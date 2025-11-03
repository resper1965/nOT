import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ComplianceStatus() {
  // Mock data - will be replaced with real API call
  const complianceData = {
    total: 100,
    compliant: 0,
    partial: 0,
    nonCompliant: 100,
    controls: [
      { name: 'MFA', status: 'non_compliant', value: 0 },
      { name: 'Patches', status: 'non_compliant', value: 0 },
      { name: 'VPN', status: 'non_compliant', value: 0 },
      { name: 'Antimalware', status: 'non_compliant', value: 0 },
      { name: 'Segmentação', status: 'non_compliant', value: 0 },
    ]
  };

  const compliancePercent = complianceData.compliant;
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (compliancePercent / 100) * circumference;

  return (
    <Card className='border-red-500/30 bg-gradient-to-br from-red-500/5 to-background'>
      <CardHeader className='border-b border-border/50'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <div className='rounded-lg bg-red-500/10 p-1.5'>
                <Shield className='h-4 w-4 text-red-500' />
              </div>
              Status de Conformidade
            </CardTitle>
            <CardDescription className='mt-1.5'>ANEEL RN 964 + ONS</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='flex h-[280px] items-center justify-center'>
          <div className='relative h-[200px] w-[200px]'>
            {/* Circle progress with gradient */}
            <svg className='h-full w-full -rotate-90' viewBox='0 0 100 100'>
              {/* Background circle */}
              <circle
                cx='50'
                cy='50'
                r='40'
                fill='none'
                stroke='currentColor'
                strokeWidth='8'
                className='text-muted opacity-20'
              />
              {/* Progress circle with gradient */}
              <defs>
                <linearGradient id='complianceGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                  <stop offset='0%' stopColor='#ef4444' />
                  <stop offset='100%' stopColor='#f97316' />
                </linearGradient>
              </defs>
              <circle
                cx='50'
                cy='50'
                r='40'
                fill='none'
                stroke='url(#complianceGradient)'
                strokeWidth='8'
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                className='transition-all duration-500'
              />
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <div className='text-4xl font-bold text-red-500'>{compliancePercent}%</div>
              <div className='mt-1 flex items-center gap-1 text-xs text-red-500'>
                <AlertCircle className='h-3 w-3' />
                <span>Não Conforme</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className='mt-6 space-y-3'>
          {complianceData.controls.map((control) => (
            <div key={control.name} className='flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:bg-muted/50'>
              <div className='flex items-center gap-2'>
                {control.status === 'compliant' ? (
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                ) : control.status === 'partial' ? (
                  <Clock className='h-4 w-4 text-orange-500' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-red-500' />
                )}
                <span className='text-sm font-medium'>{control.name}</span>
              </div>
              <span className={`text-sm font-semibold ${
                control.status === 'compliant' 
                  ? 'text-green-500' 
                  : control.status === 'partial'
                  ? 'text-orange-500'
                  : 'text-red-500'
              }`}>
                {control.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
