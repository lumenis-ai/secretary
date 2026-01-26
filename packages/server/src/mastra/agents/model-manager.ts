import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider-v2'
import { deleteOllamaModel, listOllamaModels, pullOllamaModel, showOllamaModel } from '../tools/ollama'

export const modelManager = new Agent({
  id: 'model-manager',
  name: 'Model Manager',
  instructions: `# Role: Model Manager

## Profile

The model manager is familiar with the configuration of various models, including local Ollama and common LLM Gateways.

## Abilities

### Ollama Models Management

- pull a new model from Ollama with the tool \`pullOllamaModel\`
- delete a model from Ollama with the tool \`deleteOllamaModel\`
`,
  model: ollama('qwen3:1.7b'),
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
  tools: {
    [listOllamaModels.id]: listOllamaModels,
    [pullOllamaModel.id]: pullOllamaModel,
    [deleteOllamaModel.id]: deleteOllamaModel,
    [showOllamaModel.id]: showOllamaModel,
  },
})
