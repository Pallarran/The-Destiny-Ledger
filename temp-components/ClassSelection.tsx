// Class Selection and Level Progression Component

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { rulesLoader, CharacterClass, Subclass } from '@/rules'
import { Plus, Minus } from 'lucide-react'

export interface ClassLevel {
  id: string
  classId: string
  subclassId?: string
  level: number
  features: string[]
}

export interface ClassSelectionState {
  levels: ClassLevel[]
  totalLevel: number
}

interface ClassSelectionProps {
  value: ClassSelectionState
  onChange: (value: ClassSelectionState) => void
}

export function ClassSelection({ value, onChange }: ClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<string>('')
  
  const classes = rulesLoader.getClasses()
  const classLevelCounts = new Map<string, number>()
  
  // Count levels per class
  value.levels.forEach(level => {
    classLevelCounts.set(level.classId, (classLevelCounts.get(level.classId) || 0) + 1)
  })

  const addClassLevel = () => {
    if (!selectedClass) return
    
    const newLevel: ClassLevel = {
      id: `${selectedClass}-${Date.now()}`,
      classId: selectedClass,
      level: (classLevelCounts.get(selectedClass) || 0) + 1,
      features: []
    }
    
    const newState: ClassSelectionState = {
      levels: [...value.levels, newLevel],
      totalLevel: value.totalLevel + 1
    }
    
    onChange(newState)
  }

  const removeClassLevel = (classId: string) => {
    const classLevels = value.levels.filter(l => l.classId === classId)
    if (classLevels.length === 0) return
    
    // Remove the highest level of this class
    const highestLevel = Math.max(...classLevels.map(l => l.level))
    const updatedLevels = value.levels.filter(l => 
      !(l.classId === classId && l.level === highestLevel)
    )
    
    // Renumber remaining levels for this class
    const renumberedLevels = updatedLevels.map(level => {
      if (level.classId === classId && level.level > highestLevel) {
        return { ...level, level: level.level - 1 }
      }
      return level
    })
    
    onChange({
      levels: renumberedLevels,
      totalLevel: value.totalLevel - 1
    })
  }

  const updateSubclass = (classId: string, subclassId: string) => {
    const updatedLevels = value.levels.map(level => {
      if (level.classId === classId) {
        return { ...level, subclassId }
      }
      return level
    })
    
    onChange({
      ...value,
      levels: updatedLevels
    })
  }

  const getClassInfo = (classId: string) => {
    return rulesLoader.getClass(classId)
  }

  const getSubclasses = (classId: string) => {
    return rulesLoader.getSubclasses(classId)
  }

  const getClassFeatures = (classId: string, level: number) => {
    return rulesLoader.getClassFeatures(classId, level)
  }

  const canAddLevel = () => {
    return value.totalLevel < 20 && classLevelCounts.size <= 3
  }

  const shouldShowSubclassSelection = (classId: string) => {
    const classLevels = classLevelCounts.get(classId) || 0
    const characterClass = getClassInfo(classId)
    
    // Most classes get subclass at level 3
    return classLevels >= 3 && characterClass && getSubclasses(classId).length > 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class & Levels</CardTitle>
        <CardDescription>
          Choose your character classes and level progression. You can multiclass up to 3 classes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium">Total Level:</span> {value.totalLevel}/20
          </div>
          <div className="text-sm">
            <span className="font-medium">Classes:</span> {classLevelCounts.size}/3
          </div>
        </div>

        {/* Add New Class Level */}
        {canAddLevel() && (
          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class to add" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addClassLevel} disabled={!selectedClass} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Level
            </Button>
          </div>
        )}

        {/* Current Classes */}
        <div className="space-y-4">
          {Array.from(classLevelCounts.entries()).map(([classId, levelCount]) => {
            const characterClass = getClassInfo(classId)
            if (!characterClass) return null

            const subclasses = getSubclasses(classId)
            const currentSubclass = value.levels.find(l => l.classId === classId)?.subclassId
            const features = getClassFeatures(classId, levelCount)

            return (
              <Card key={classId} className="border-l-4 border-l-primary/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{characterClass.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Level {levelCount} • Hit Die: d{characterClass.hitDie}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeClassLevel(classId)}
                        disabled={levelCount <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {levelCount}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(classId)
                          addClassLevel()
                        }}
                        disabled={!canAddLevel()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subclass Selection */}
                  {shouldShowSubclassSelection(classId) && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">Subclass</Label>
                      <Select
                        value={currentSubclass || ''}
                        onValueChange={(value) => updateSubclass(classId, value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose subclass..." />
                        </SelectTrigger>
                        <SelectContent>
                          {subclasses.map((subclass) => (
                            <SelectItem key={subclass.id} value={subclass.id}>
                              {subclass.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Proficiencies */}
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Proficiencies</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium">Saving Throws:</span>{' '}
                        {characterClass.savingThrowProficiencies.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Skills:</span>{' '}
                        Choose {characterClass.skillChoices.count} from{' '}
                        {characterClass.skillChoices.options.slice(0, 3).join(', ')}
                        {characterClass.skillChoices.options.length > 3 && '...'}
                      </div>
                    </div>
                  </div>

                  {/* Features Preview */}
                  {features.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Class Features</div>
                      <div className="space-y-1">
                        {features.slice(0, 5).map((feature) => (
                          <div key={feature.id} className="text-xs text-muted-foreground">
                            <span className="font-medium">Level {feature.level}:</span>{' '}
                            {feature.name}
                          </div>
                        ))}
                        {features.length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            ...and {features.length - 5} more features
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Multiclass Restrictions */}
        {classLevelCounts.size > 1 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-1">
              Multiclass Requirements
            </div>
            <div className="text-xs text-yellow-700">
              Remember that multiclassing requires minimum ability scores (usually 13) in both your current class and the class you want to add. 
              Some features like Extra Attack don't stack between classes.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}