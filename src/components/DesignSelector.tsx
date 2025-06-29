
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DesignSelectorProps {
  selectedDesign: string;
  onDesignChange: (design: string) => void;
}

const DesignSelector: React.FC<DesignSelectorProps> = ({ selectedDesign, onDesignChange }) => {
  const designs = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Simple, clean text',
      category: 'Basic'
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Glowing cyan neon effect',
      category: 'Glow'
    },
    {
      id: 'glow',
      name: 'Soft Glow',
      description: 'Subtle glowing outline',
      category: 'Glow'
    },
    {
      id: 'outline',
      name: 'Bold Outline',
      description: 'Thick colored border',
      category: 'Basic'
    },
    {
      id: 'gradient',
      name: 'Rainbow Gradient',
      description: 'Multi-color gradient fill',
      category: 'Color'
    },
    {
      id: 'shadow',
      name: 'Drop Shadow',
      description: 'Classic drop shadow',
      category: 'Basic'
    },
    {
      id: 'retro',
      name: 'Retro 80s',
      description: 'Pink, cyan, yellow layers',
      category: 'Retro'
    },
    {
      id: 'fire',
      name: 'Fire Effect',
      description: 'Orange to yellow gradient',
      category: 'Element'
    },
    {
      id: 'ice',
      name: 'Ice Crystal',
      description: 'Cool blue gradient',
      category: 'Element'
    },
    {
      id: 'matrix',
      name: 'Matrix Code',
      description: 'Green digital rain effect',
      category: 'Digital'
    },
    {
      id: 'hologram',
      name: 'Hologram',
      description: 'Futuristic holographic look',
      category: 'Digital'
    },
    {
      id: 'vintage',
      name: 'Vintage',
      description: 'Warm sepia tones',
      category: 'Retro'
    },
    {
      id: 'cyber',
      name: 'Cyberpunk',
      description: 'Cyber aesthetic outline',
      category: 'Digital'
    },
    {
      id: 'pop',
      name: 'Pop Colors',
      description: 'Bright changing colors',
      category: 'Color'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Ultra clean design',
      category: 'Basic'
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Thick and strong',
      category: 'Basic'
    },
    {
      id: 'neon-pink',
      name: 'Neon Pink',
      description: 'Hot pink neon glow',
      category: 'Glow'
    },
    {
      id: 'electric',
      name: 'Electric',
      description: 'Electric blue sparks',
      category: 'Element'
    },
    {
      id: 'chrome',
      name: 'Chrome',
      description: 'Metallic chrome finish',
      category: 'Metal'
    },
    {
      id: 'gold',
      name: 'Golden',
      description: 'Luxury gold gradient',
      category: 'Metal'
    },
    {
      id: 'space',
      name: 'Space',
      description: 'Cosmic starfield effect',
      category: 'Fantasy'
    },
    {
      id: 'laser',
      name: 'Laser',
      description: 'Sharp laser-cut look',
      category: 'Digital'
    }
  ];

  const categories = [...new Set(designs.map(d => d.category))];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Counter Designs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-400 mb-2">{category}</h3>
                <div className="grid gap-2">
                  {designs
                    .filter(design => design.category === category)
                    .map(design => (
                      <div
                        key={design.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-gray-500 ${
                          selectedDesign === design.id
                            ? 'border-white bg-gray-800'
                            : 'border-gray-700 bg-gray-850'
                        }`}
                        onClick={() => onDesignChange(design.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">
                            {design.name}
                          </span>
                          {selectedDesign === design.id && (
                            <Badge variant="secondary" className="bg-white text-black text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{design.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Preview Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 text-sm space-y-2">
          <p>• Each design has unique visual effects</p>
          <p>• Some designs work better with specific fonts</p>
          <p>• Background color affects design visibility</p>
          <p>• Higher font sizes enhance effects</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSelector;
