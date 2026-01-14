import { tool } from 'ai'
import ollama from 'ollama'
import { z } from 'zod'

const ModelDetailsSchema = z.object({
  format: z.string().describe('Model file format (for example gguf)'),
  family: z.string().describe('Primary model family (for example llama)'),
  families: z.array(z.string()).describe('All families the model belongs to, when applicable'),
  parameter_size: z.string().describe('Approximate parameter count label (for example 7B, 13B)'),
})
const ModelResponseSchema = z.object({
  name: z.string().describe('Model name'),
  modified_at: z.string().describe('Last modified timestamp in ISO 8601 format'),
  size: z.number().describe('Total size of the model on disk in GB'),
  details: ModelDetailsSchema,
})
export const listOllamaModels = tool({
  title: 'List all local models from Ollama',
  description: 'List all local models from Ollama',
  inputSchema: z.object({}),
  outputSchema: z.object({
    models: z.array(ModelResponseSchema),
  }),
  execute: async () => {
    const res = await ollama.list()
    const models = res.models.map(model => ({
      name: model.name,
      modified_at: model.modified_at as unknown as string,
      size: Math.ceil(model.size / 1024 / 1024 / 1024 * 100) / 100,
      details: {
        format: model.details.format,
        family: model.details.family,
        families: model.details.families,
        parameter_size: model.details.parameter_size,
      },
    }))

    return {
      models,
    }
  },
})

const ModelDetailSchema = z.object({
  parameters: z.string().describe('Model parameter settings serialized as text'),
  license: z.string().describe('The license of the model'),
  modified_at: z.string().describe('Last modified timestamp in ISO format'),
  capabilities: z.array(z.string()).describe('List of supported features'),
  model_info: z.record(z.string(), z.unknown()).describe('Additional model metadata'),
})
export const showOllamaModel = tool({
  title: 'Show a model detail from Ollama',
  description: 'Show a model detail from Ollama',
  inputSchema: z.object({
    model: z.string().describe('Model name of ollama'),
  }),
  outputSchema: z.object({
    detail: ModelDetailSchema,
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

export const pullOllamaModel = tool({
  title: 'Pull a model from Ollama',
  description: 'Pull a model from Ollama',
  inputSchema: z.object({
    model: z.string(),
  }),
  inputExamples: [
    {
      input: {
        model: 'qwen3:1.7b',
      },
    },
  ],
  needsApproval: true,
  execute: async ({ model }) => {
    ollama.pull({
      model,
    })
  },
})

export const deleteOllamaModel = tool({
  title: 'Delete a model from Ollama',
  description: 'Delete a model from Ollama',
  inputSchema: z.object({
    model: z.string(),
  }),
  outputSchema: z.object({
    status: z.string().describe('The status of the model deletion'),
  }),
  needsApproval: true,
  execute: async ({ model }) => {
    const result = await ollama.delete({
      model,
    })

    return {
      status: result?.status,
    }
  },
})
