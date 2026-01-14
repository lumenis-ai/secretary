import { ToolLoopAgent } from 'ai'
import { ollama } from 'ollama-ai-provider-v2'
import { deleteOllamaModel, listOllamaModels, pullOllamaModel, showOllamaModel } from '@/tools/ollama'

export const modelManager = new ToolLoopAgent({
  id: 'model-manager',
  model: ollama('qwen3:1.7b'),
  instructions: `# Role: Model Manager

## Profile

The model manager is familiar with the configuration of various models, including local Ollama and common LLM Gateways.

## Abilities

### Ollama Models Management

- pull a new model from Ollama with the tool \`pullOllamaModel\`
- delete a model from Ollama with the tool \`deleteOllamaModel\`
`,
  tools: {
    listOllamaModels,
    showOllamaModel,
    deleteOllamaModel,
    pullOllamaModel,
  },
  providerOptions: {
    ollama: {
      think: true,
    },
  },
})
