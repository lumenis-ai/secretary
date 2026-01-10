use serde_json::json;
use std::sync::Mutex;
use tauri::RunEvent;
use tauri::{async_runtime::spawn, Manager};
use tauri_plugin_shell::{
    process::{CommandChild, CommandEvent},
    ShellExt,
};
use tauri_plugin_store::StoreExt;


#[derive(Default)]
struct AppState {
    server_child: Mutex<Option<CommandChild>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState::default())
        .setup(|app| {
            let app_state = app.state::<AppState>();
            let store = app.store("data.json").unwrap();

            let server_sidebar_command = app.shell().sidecar("server").unwrap();
            let (mut rx, child) = server_sidebar_command.spawn().unwrap();
            spawn(async move {
                while let Some(event) = rx.recv().await {
                    match event {
                        CommandEvent::Stdout(line) | CommandEvent::Stderr(line) => {
                            if let Ok(line_str) = String::from_utf8(line) {
                                if let Some(port) = line_str.trim().strip_prefix("PORT=") {
                                    store.set("server_port", json!(port));
                                    println!("server sidecar started on port: {}", port);
                                }
                            }
                        }
                        _ => {}
                    }
                }
            });
            *app_state.server_child.lock().unwrap() = Some(child);

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app, event| match event {
            RunEvent::ExitRequested { .. } => {
                if let Some(child) = app.state::<AppState>().server_child.lock().unwrap().take() {
                    child.kill().unwrap();
                }
            }
            _ => {}
        });
}
