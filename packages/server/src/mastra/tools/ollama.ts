import { createTool } from '@mastra/core/tools'
import ollama from 'ollama'
import { z } from 'zod'

export const listOllamaModels = createTool({
  id: 'list-ollama-models',
  description: 'List all local models from Ollama',
  outputSchema: z.object({
    models: z.array(z.object({
      name: z.string(),
      modified_at: z.string(),
      size: z.number(),
      details: z.object({
        format: z.string(),
        family: z.string(),
        families: z.array(z.string()),
        parameter_size: z.string(),
      }),
    })),
  }),
  execute: async () => {
    const res = await ollama.list()

    return {
      models: res.models.map(model => ({
        name: model.name,
        modified_at: model.modified_at as unknown as string,
        size: Math.ceil(model.size / 1024 / 1024 / 1024 * 100) / 100,
        details: {
          format: model.details.format,
          family: model.details.family,
          families: model.details.families,
          parameter_size: model.details.parameter_size,
        },
      })),
    }
  },
})

export const showOllamaModel = createTool({
  id: 'show-ollama-model',
  description: 'Show a model detail from Ollama',
  inputSchema: z.object({
    model: z.string(),
  }),
  outputSchema: z.object({
    detail: z.object({
      parameters: z.string(),
      license: z.string(),
      modified_at: z.string(),
      capabilities: z.array(z.string()),
      model_info: z.record(z.string(), z.unknown()),
    }),
  }),
  execute: async ({ model }) => {
    const detail = await ollama.show({
      model,
    })
    return {
      detail: {
        parameters: detail.parameters,
        license: detail.license,
        modified_at: detail.modified_at as unknown as string,
        capabilities: detail.capabilities,
        model_info: detail.model_info as unknown as Record<string, unknown>,
      },
    }
  },
})

export const pullOllamaModel = createTool({
  id: 'pull-ollama-model',
  description: 'Pull a model from Ollama',
  inputSchema: z.object({
    model: z.string().describe('Model name of ollama'),
  }),
  requireApproval: true,
  execute: async ({ model }) => {
    const result = await ollama.pull({
      model,
    })

    return {
      status: result?.status,
    }
  },
})

export const deleteOllamaModel = createTool({
  id: 'delete-ollama-model',
  description: 'Delete a model from Ollama',
  inputSchema: z.object({
    model: z.string().describe('Model name of ollama'),
  }),
  outputSchema: z.object({
    status: z.string().describe('The status of the model pull'),
  }),
  requireApproval: true,
  execute: async ({ model }) => {
    const result = await ollama.delete({
      model,
    })
    return {
      status: result?.status,
    }
  },
})
