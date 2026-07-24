import { Layout } from './shared/components/layout/Layout'
import { Card } from './shared/components/ui/Card'
import { Badge } from './shared/components/ui/Badge'
import { Button } from './shared/components/ui/Button'

function App() {
  return (
    <Layout>
      <div className="flex gap-4 mb-8">
        <div data-decada="70s" className="p-8">
          <Button variant="primary">Primario 70s</Button>
        </div>

        <div data-decada="80s" className="p-8">
          <Button variant="primary">Primario 80s</Button>
        </div>

        <div data-decada="90s" className="p-8">
          <Button variant="primary">Primario 90s</Button>
        </div>

        <div data-decada="2000s" className="p-8">
          <Button variant="primary">Primario 2000s</Button>
        </div>
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