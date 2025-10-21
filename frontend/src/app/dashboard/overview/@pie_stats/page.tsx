import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ComplianceStatus() {
  const controls = [
    { name: 'Conformidade ONS', value: 0, max: 100, color: 'bg-red-500' },
    { name: 'Documentos', value: 0, max: 50, color: 'bg-orange-500' },
    { name: 'Controles', value: 0, max: 5, color: 'bg-red-500' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Status de Conformidade</CardTitle>
          <CardDescription>ANEEL RN 964 + ONS</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex h-[280px] items-center justify-center">
          <div className="relative h-[200px] w-[200px]">
            {/* Circle progress */}
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
                opacity="0.2"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="251.2"
                strokeLinecap="round"
                className="text-red-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-red-500">0%</div>
              <div className="text-xs text-muted-foreground">Não Conforme</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {controls.map((control) => (
            <div key={control.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{control.name}</span>
              <span className="font-medium">
                {control.value}/{control.max}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
