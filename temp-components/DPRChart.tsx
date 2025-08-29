// DPR Chart Visualization Component

import { useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface DPRCurveData {
  ac: number[]
  normal: number[]
  advantage: number[]
  disadvantage: number[]
}

interface DPRChartProps {
  data: DPRCurveData
  title?: string
  description?: string
}

export function DPRChart({ data, title = "DPR vs AC", description }: DPRChartProps) {
  const chartData = useMemo(() => {
    return data.ac.map((ac, index) => ({
      ac,
      Normal: Math.round(data.normal[index] * 100) / 100,
      Advantage: Math.round(data.advantage[index] * 100) / 100,
      Disadvantage: Math.round(data.disadvantage[index] * 100) / 100,
    }))
  }, [data])

  const maxDPR = useMemo(() => {
    return Math.max(
      ...data.normal,
      ...data.advantage,
      ...data.disadvantage
    )
  }, [data])

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`AC ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value} DPR`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="ac" 
              className="fill-muted-foreground"
              label={{ value: 'Armor Class', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              className="fill-muted-foreground"
              label={{ value: 'Damage Per Round', angle: -90, position: 'insideLeft' }}
              domain={[0, Math.ceil(maxDPR * 1.1)]}
            />
            <Tooltip content={customTooltip} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Normal" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Advantage" 
              stroke="hsl(120, 60%, 50%)" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="Disadvantage" 
              stroke="hsl(0, 60%, 50%)" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              strokeDasharray="10 5"
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-primary">Normal</div>
            <div className="text-muted-foreground">
              Peak: {Math.max(...data.normal).toFixed(1)} DPR
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium" style={{ color: 'hsl(120, 60%, 50%)' }}>Advantage</div>
            <div className="text-muted-foreground">
              Peak: {Math.max(...data.advantage).toFixed(1)} DPR
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium" style={{ color: 'hsl(0, 60%, 50%)' }}>Disadvantage</div>
            <div className="text-muted-foreground">
              Peak: {Math.max(...data.disadvantage).toFixed(1)} DPR
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Breakpoint Analysis Table Component
interface BreakpointData {
  ac: number
  useOptimal: boolean
  regularDPR: number
  optimalDPR: number
  difference: number
}

interface BreakpointTableProps {
  data: BreakpointData[]
  title?: string
  description?: string
  optimizationName?: string // e.g., "GWM", "Sharpshooter"
}

export function BreakpointTable({ 
  data, 
  title = "Optimization Breakpoints", 
  description,
  optimizationName = "Optimization"
}: BreakpointTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">AC</th>
                <th className="text-left p-2">Regular DPR</th>
                <th className="text-left p-2">{optimizationName} DPR</th>
                <th className="text-left p-2">Difference</th>
                <th className="text-left p-2">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.ac} className="border-b">
                  <td className="p-2 font-medium">{row.ac}</td>
                  <td className="p-2">{row.regularDPR.toFixed(1)}</td>
                  <td className="p-2">{row.optimalDPR.toFixed(1)}</td>
                  <td className={`p-2 ${row.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.difference >= 0 ? '+' : ''}{row.difference.toFixed(1)}
                  </td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      row.useOptimal 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.useOptimal ? optimizationName : 'Regular'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Breakpoint Summary */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-1">Quick Reference</div>
          <div className="text-xs text-muted-foreground">
            Use {optimizationName} against AC {data.find(d => d.useOptimal)?.ac || 'N/A'} and lower for optimal damage.
            Switch to regular attacks against higher AC targets.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Multi-build Comparison Chart
interface ComparisonData {
  ac: number
  [buildName: string]: number
}

interface ComparisonChartProps {
  data: ComparisonData[]
  buildNames: string[]
  title?: string
}

export function ComparisonChart({ data, buildNames, title = "Build Comparison" }: ComparisonChartProps) {
  const colors = [
    'hsl(var(--primary))',
    'hsl(120, 60%, 50%)', 
    'hsl(0, 60%, 50%)',
    'hsl(240, 60%, 50%)',
    'hsl(60, 60%, 50%)'
  ]

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`AC ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toFixed(1)} DPR`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="ac" 
              className="fill-muted-foreground"
              label={{ value: 'Armor Class', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              className="fill-muted-foreground"
              label={{ value: 'Damage Per Round', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={customTooltip} />
            <Legend />
            {buildNames.map((buildName, index) => (
              <Line
                key={buildName}
                type="monotone"
                dataKey={buildName}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}