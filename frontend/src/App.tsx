import { Layout } from './shared/components/layout/Layout'
import { Card } from './shared/components/ui/Card'
import { Badge } from './shared/components/ui/Badge'
import { Button } from './shared/components/ui/Button'

function App() {
  return (
    <Layout>
      <div className="flex gap-4 mb-8">
        <Button variant="primary">Primario</Button>
        <Button variant="secondary">Secundario</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <Card
        title="Titanes en el Ring"
        description="El programa de lucha libre más popular de la TV argentina."
        meta={
          <>
            <Badge>1962</Badge>
            <Badge variant="accent">TV</Badge>
          </>
        }
      />
    </Layout>
  )
}

export default App