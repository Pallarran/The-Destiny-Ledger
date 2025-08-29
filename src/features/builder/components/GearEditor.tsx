import { useState } from 'react'
import { Sword, Shield, Target, Package } from 'lucide-react'
import { Gear, Weapon } from '../../../stores/types'
import { rulesLoader } from '../../../rules/loader'

interface GearEditorProps {
  gear: Gear
  onUpdateGear: (gear: Partial<Gear>) => void
}

export function GearEditor({ gear, onUpdateGear }: GearEditorProps) {
  const [selectedSlot, setSelectedSlot] = useState<'mainHand' | 'offHand' | 'ranged' | 'armor' | null>(null)
  
  const weapons = rulesLoader.getWeapons()
  
  // Convert SRD weapon to Build weapon format
  const convertWeapon = (srdWeapon: any): Weapon => ({
    id: srdWeapon.id,
    name: srdWeapon.name,
    weaponType: srdWeapon.category,
    damage: `${srdWeapon.damage.dice[0].count}d${srdWeapon.damage.dice[0].sides}`,
    damageType: srdWeapon.damage.damageType,
    properties: srdWeapon.properties,
    range: srdWeapon.range?.normal,
    enchantment: 0
  })

  const handleWeaponSelect = (slotType: keyof Pick<Gear, 'mainHand' | 'offHand' | 'ranged'>, weaponId: string) => {
    const srdWeapon = weapons.find(w => w.id === weaponId)
    if (!srdWeapon) return
    
    const weapon = convertWeapon(srdWeapon)
    onUpdateGear({ [slotType]: weapon })
    setSelectedSlot(null)
  }

  const handleRemoveWeapon = (slotType: keyof Pick<Gear, 'mainHand' | 'offHand' | 'ranged'>) => {
    onUpdateGear({ [slotType]: undefined })
  }

  const getWeaponsByCategory = (categories: string[]) => {
    return weapons.filter(weapon => categories.includes(weapon.category))
  }

  return (
    <div className="card-fantasy p-6">
      <h3 className="text-xl font-serif font-bold text-arcane-800 mb-4">Equipment & Gear</h3>
      
      {/* Weapon Slots */}
      <div className="mb-6">
        <h4 className="font-serif font-semibold text-arcane-800 mb-3">Weapons</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main Hand */}
          <div className="p-4 bg-parchment-50 rounded-lg border border-parchment-200">
            <div className="flex items-center gap-2 mb-3">
              <Sword className="h-4 w-4 text-arcane-600" />
              <span className="font-serif font-medium text-arcane-800">Main Hand</span>
            </div>
            
            {gear.mainHand ? (
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-arcane-700">{gear.mainHand.name}</div>
                  <div className="text-sm text-parchment-600">
                    {gear.mainHand.damage} {gear.mainHand.damageType}
                  </div>
                  {(gear.mainHand.enchantment ?? 0) > 0 && (
                    <div className="text-sm text-arcane-600 font-semibold">
                      +{gear.mainHand.enchantment} Enhancement
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSlot('mainHand')}
                    className="px-2 py-1 text-xs bg-arcane-100 text-arcane-700 rounded hover:bg-arcane-200"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => handleRemoveWeapon('mainHand')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedSlot('mainHand')}
                className="w-full p-3 border-2 border-dashed border-parchment-300 rounded-lg text-parchment-500 hover:border-arcane-400 hover:text-arcane-600 transition-colors"
              >
                Select Weapon
              </button>
            )}
          </div>

          {/* Off Hand */}
          <div className="p-4 bg-parchment-50 rounded-lg border border-parchment-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-arcane-600" />
              <span className="font-serif font-medium text-arcane-800">Off Hand</span>
            </div>
            
            {gear.offHand ? (
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-arcane-700">{gear.offHand.name}</div>
                  <div className="text-sm text-parchment-600">
                    {gear.offHand.damage} {gear.offHand.damageType}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSlot('offHand')}
                    className="px-2 py-1 text-xs bg-arcane-100 text-arcane-700 rounded hover:bg-arcane-200"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => handleRemoveWeapon('offHand')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedSlot('offHand')}
                className="w-full p-3 border-2 border-dashed border-parchment-300 rounded-lg text-parchment-500 hover:border-arcane-400 hover:text-arcane-600 transition-colors"
              >
                Select Shield/Weapon
              </button>
            )}
          </div>

          {/* Ranged */}
          <div className="p-4 bg-parchment-50 rounded-lg border border-parchment-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-arcane-600" />
              <span className="font-serif font-medium text-arcane-800">Ranged</span>
            </div>
            
            {gear.ranged ? (
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-arcane-700">{gear.ranged.name}</div>
                  <div className="text-sm text-parchment-600">
                    {gear.ranged.damage} {gear.ranged.damageType}
                  </div>
                  {gear.ranged.range && (
                    <div className="text-sm text-parchment-600">
                      Range: {gear.ranged.range} ft
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSlot('ranged')}
                    className="px-2 py-1 text-xs bg-arcane-100 text-arcane-700 rounded hover:bg-arcane-200"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => handleRemoveWeapon('ranged')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedSlot('ranged')}
                className="w-full p-3 border-2 border-dashed border-parchment-300 rounded-lg text-parchment-500 hover:border-arcane-400 hover:text-arcane-600 transition-colors"
              >
                Select Ranged Weapon
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weapon Selection Modal */}
      {selectedSlot && (
        <div className="mb-6 p-4 bg-arcane-50 rounded-lg border-2 border-arcane-300">
          <h4 className="font-serif font-semibold text-arcane-800 mb-3">
            Select {selectedSlot === 'mainHand' ? 'Main Hand' : selectedSlot === 'offHand' ? 'Off Hand' : 'Ranged'} Weapon
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 max-h-64 overflow-y-auto">
            {getWeaponsByCategory(
              selectedSlot === 'ranged' 
                ? ['simple_ranged', 'martial_ranged']
                : ['simple_melee', 'martial_melee']
            ).map(weapon => (
              <button
                key={weapon.id}
                onClick={() => handleWeaponSelect(selectedSlot as keyof Pick<Gear, 'mainHand' | 'offHand' | 'ranged'>, weapon.id)}
                className="p-3 text-left bg-parchment-50 border border-parchment-300 rounded-lg hover:border-arcane-400 hover:bg-arcane-50 transition-colors"
              >
                <div className="font-semibold text-arcane-800">{weapon.name}</div>
                <div className="text-sm text-parchment-600">
                  {weapon.damage.dice[0].count}d{weapon.damage.dice[0].sides} {weapon.damage.damageType}
                </div>
                <div className="text-xs text-parchment-500 mt-1">
                  {weapon.properties.join(', ')}
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setSelectedSlot(null)}
            className="btn-parchment"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Armor Slot */}
      <div className="mb-6">
        <h4 className="font-serif font-semibold text-arcane-800 mb-3">Armor</h4>
        <div className="p-4 bg-parchment-50 rounded-lg border border-parchment-200">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-arcane-600" />
            <span className="font-serif font-medium text-arcane-800">Armor</span>
          </div>
          
          {gear.armor ? (
            <div>
              <div className="font-semibold text-arcane-700">{gear.armor.name}</div>
              <div className="text-sm text-parchment-600">AC: {gear.armor.baseAC}</div>
            </div>
          ) : (
            <div className="p-3 border-2 border-dashed border-parchment-300 rounded-lg text-parchment-500 text-center">
              No armor equipped
              <div className="text-xs mt-1">Armor selection coming in future update</div>
            </div>
          )}
        </div>
      </div>

      {/* Magic Item Bonuses */}
      <div>
        <h4 className="font-serif font-semibold text-arcane-800 mb-3">Magic Item Bonuses</h4>
        <div className="p-4 bg-parchment-50 rounded-lg border border-parchment-200">
          <div className="text-center text-parchment-500">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-serif">Magic items and bonuses</p>
            <p className="text-sm">Coming in future update</p>
          </div>
        </div>
      </div>
    </div>
  )
}