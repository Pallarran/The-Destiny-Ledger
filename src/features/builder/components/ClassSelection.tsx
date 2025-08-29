import { useState } from 'react'
import { Sword, Target, Leaf } from 'lucide-react'
import { LevelEntry } from '../../../stores/types'
import { rulesLoader } from '../../../rules/loader'

interface ClassSelectionProps {
  levelTimeline: LevelEntry[]
  onAddLevel: (entry: Omit<LevelEntry, 'level'>) => void
  onUpdateLevel: (level: number, updates: Partial<LevelEntry>) => void
  onRemoveLevel: (level: number) => void
}

const CLASS_ICONS = {
  fighter: Sword,
  rogue: Target,
  ranger: Leaf,
}

const CLASS_COLORS = {
  fighter: 'border-red-300 bg-red-50 text-red-800',
  rogue: 'border-purple-300 bg-purple-50 text-purple-800',
  ranger: 'border-green-300 bg-green-50 text-green-800',
}

export function ClassSelection({ 
  levelTimeline, 
  onAddLevel, 
  onUpdateLevel, 
  onRemoveLevel 
}: ClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSubclass, setSelectedSubclass] = useState<string>('')
  
  const classes = rulesLoader.getClasses()
  const currentLevel = levelTimeline.length + 1
  const canAddLevel = currentLevel <= 20
  
  // Get available subclasses for selected class
  const availableSubclasses = selectedClass ? rulesLoader.getSubclasses(selectedClass) : []
  
  // Check if subclass selection is required (typically at level 3 for most classes)
  const requiresSubclass = selectedClass && currentLevel >= 3

  const handleAddLevel = () => {
    if (!selectedClass) return
    
    const characterClass = rulesLoader.getClass(selectedClass)
    if (!characterClass) return
    
    // Get features for this level
    const classFeatures = rulesLoader.getClassFeatures(selectedClass, currentLevel)
    const subclassFeatures = selectedSubclass ? rulesLoader.getSubclassFeatures(selectedSubclass, currentLevel) : []
    
    const features = [
      ...classFeatures.filter(f => f.level === currentLevel).map(f => f.id),
      ...subclassFeatures.filter(f => f.level === currentLevel).map(f => f.id)
    ]
    
    // Check if this level gets ASI or Feat (levels 4, 8, 12, 16, 19 for most classes)
    const asiLevels = [4, 8, 12, 16, 19]
    const getsAsiOrFeat = asiLevels.includes(currentLevel)
    
    onAddLevel({
      classId: selectedClass,
      subclassId: selectedSubclass || undefined,
      features,
      asiOrFeat: getsAsiOrFeat ? 'asi' : undefined,
    })
    
    // Keep class selection for next level
    // setSelectedClass('')
    // setSelectedSubclass('')
  }

  const handleRemoveLevel = (level: number) => {
    onRemoveLevel(level)
    // If we removed the last level, clear selections to allow re-selection
    if (level === levelTimeline.length) {
      // Don't clear class selection to make it easier to continue
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Class & Level Progression</h2>
        <p className="text-gray-600">Build your character level by level</p>
      </div>
      
      {/* Modern Level Display */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm border-2 border-emerald-200 mb-4">
            <span className="text-2xl font-bold text-emerald-600">{currentLevel}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Level {currentLevel}</h3>
          <p className="text-gray-600">
            {canAddLevel ? 'Ready to add your next level' : 'Maximum level reached (20)'}
          </p>
        </div>
      </div>

      {/* Modern Class Selection */}
      {canAddLevel && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Level {currentLevel}
          </h3>
          
          {/* Class Selection */}
          <div className="mb-4">
            <label className="block text-sm font-serif font-medium text-parchment-700 mb-2">
              Choose Class
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {classes.map(characterClass => {
                const Icon = CLASS_ICONS[characterClass.id as keyof typeof CLASS_ICONS] || Sword
                const colorClass = CLASS_COLORS[characterClass.id as keyof typeof CLASS_COLORS] || 'border-gray-300 bg-gray-50 text-gray-800'
                
                return (
                  <button
                    key={characterClass.id}
                    onClick={() => {
                      setSelectedClass(characterClass.id)
                      setSelectedSubclass('')
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedClass === characterClass.id
                        ? `${colorClass} ring-2 ring-offset-2 ring-arcane-500`
                        : 'border-parchment-300 bg-parchment-50 hover:border-arcane-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-serif font-medium">{characterClass.name}</span>
                    </div>
                    <div className="text-xs text-parchment-600">
                      Hit Die: d{characterClass.hitDie} | 
                      Primary: {characterClass.primaryAbility.join(', ')}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subclass Selection */}
          {requiresSubclass && availableSubclasses.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-serif font-medium text-parchment-700 mb-2">
                Choose Subclass (Required at Level 3)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSubclasses.map(subclass => (
                  <button
                    key={subclass.id}
                    onClick={() => setSelectedSubclass(subclass.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedSubclass === subclass.id
                        ? 'border-arcane-500 bg-arcane-50'
                        : 'border-parchment-300 bg-parchment-50 hover:border-arcane-300'
                    }`}
                  >
                    <div className="font-serif font-medium text-arcane-800 mb-1">
                      {subclass.name}
                    </div>
                    <div className="text-xs text-parchment-600 line-clamp-2">
                      {subclass.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Level Button */}
          <button
            onClick={handleAddLevel}
            disabled={Boolean(!selectedClass || (requiresSubclass && !selectedSubclass))}
            className="btn-arcane disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            Add Level {currentLevel}
          </button>
        </div>
      )}

      {/* Level Timeline */}
      <div className="space-y-3">
        <h4 className="font-serif font-semibold text-arcane-800">Level Timeline</h4>
        
        {levelTimeline.length === 0 ? (
          <div className="text-center py-8 text-parchment-500">
            <p className="font-serif">No levels added yet</p>
            <p className="text-sm">Choose a class above to begin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {levelTimeline.map(entry => {
              const characterClass = rulesLoader.getClass(entry.classId)
              const subclass = entry.subclassId ? rulesLoader.getSubclass(entry.subclassId) : null
              const Icon = CLASS_ICONS[entry.classId as keyof typeof CLASS_ICONS] || Sword
              const colorClass = CLASS_COLORS[entry.classId as keyof typeof CLASS_COLORS] || 'border-gray-300 bg-gray-50 text-gray-800'
              
              return (
                <div
                  key={entry.level}
                  className={`p-3 rounded-lg border ${colorClass} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-bold font-mono">L{entry.level}</span>
                    </div>
                    <div>
                      <div className="font-serif font-medium">
                        {characterClass?.name}
                        {subclass && ` (${subclass.name})`}
                      </div>
                      <div className="text-xs">
                        {entry.features.length} features
                        {entry.asiOrFeat && ` | ${entry.asiOrFeat === 'asi' ? 'ASI' : 'Feat'}`}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveLevel(entry.level)}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}