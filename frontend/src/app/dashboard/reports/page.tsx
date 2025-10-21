export default function TemplatePage() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h1 className='text-3xl font-bold'>Título da Página</h1>
        <p className='text-muted-foreground'>Descrição da página</p>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <p className='text-muted-foreground'>Conteúdo em desenvolvimento...</p>
      </div>
    </div>
  )
}
