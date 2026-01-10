import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LocalModels from './local'

export default function Models() {
  return (
    <div>
      <Tabs defaultValue="local">
        <TabsList>
          <TabsTrigger value="local">
            Local
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="local"
        >
          <LocalModels />
        </TabsContent>
      </Tabs>
    </div>
  )
}
