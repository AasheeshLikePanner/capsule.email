import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { BadgeInfo, Building, Palette, FileText, Users } from 'lucide-react';
import ColorPickerInput from "@/components/color-picker-input";

export default function BrandKitForm({ brandKit, setBrandKit }:any) {
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setBrandKit({ ...brandKit, [name]: value });
  };

  const handleColorChange = (e:any) => {
    const { name, value } = e.target;
    setBrandKit({ ...brandKit, colors: { ...brandKit.colors, [name]: value } });
  };

  return (
    <div className="space-y-8 p-10 mx-auto  md:p-8">
      <div className="space-y-6">
        <div id="brand-details" className="p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2"><Building size={20}/> Brand Details</div>
          </div>
          <div className="space-y-4 mt-16">
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="flex-1">
                <Label htmlFor="kitName" className="text-muted-foreground">Kit Name</Label>
                <Input
                  id="kitName"
                  name="kitName"
                  value={brandKit.kitName}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="website" className="text-muted-foreground">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={brandKit.website}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="">
              <Label htmlFor="brandSummary" className="text-muted-foreground">Brand Summary</Label>
              <Textarea
                id="brandSummary"
                name="brandSummary"
                value={brandKit.brandSummary}
                onChange={handleInputChange}

                className="rounded-xl h-28"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-muted-foreground">Address</Label>
              <Input
                id="address"
                name="address"
                value={brandKit.address}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="toneOfVoice" className="text-muted-foreground">Tone of Voice</Label>
              <Input
                id="toneOfVoice"
                name="toneOfVoice"
                value={brandKit.toneOfVoice}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div id="legal" className="p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2"><FileText size={20}/> Legal</div>
          </div>
          <div className="space-y-4">
          <div>
              <Label htmlFor="copyright" className="text-muted-foreground">Copyright</Label>
              <Input
                id="copyright"
                name="copyright"
                value={brandKit.copyright}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="footer" className="text-muted-foreground">Footer</Label>
              <Textarea
                id="footer"
                name="footer"
                value={brandKit.footer}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="disclaimers" className="text-muted-foreground">Disclaimers</Label>
              <Textarea
                id="disclaimers"
                name="disclaimers"
                value={brandKit.disclaimers}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        <div id="social" className="p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2"><Users size={20}/> Social</div>
          </div>
          <div>
              <Label htmlFor="socials" className="text-muted-foreground">Socials</Label>
              <Input
                id="socials"
                name="socials"
                value={brandKit.socials}
                onChange={handleInputChange}
                className="rounded-xl"
                placeholder="Add your social links here"
              />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div id="logos" className="p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2"><BadgeInfo size={20}/> Logos</div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="primaryLogo" className="text-muted-foreground">Primary</Label>
              <Input id="primaryLogo" type="file" className="rounded-lg"/>
            </div>
            <div>
              <Label htmlFor="iconLogo" className="text-muted-foreground">Icon</Label>
              <Input id="iconLogo" type="file" className="rounded-lg"/>
            </div>
          </div>
        </div>
        <div id="colors" className="p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2"><Palette size={20}/> Colors</div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 min-h-[300px]">
            <ColorPickerInput
              color={brandKit.colors.background}
              onChange={(color) => setBrandKit({ ...brandKit, colors: { ...brandKit.colors, background: color } })}
              label="Background"
              description="The main background of your email"
            />
            <ColorPickerInput
              color={brandKit.colors.container}
              onChange={(color) => setBrandKit({ ...brandKit, colors: { ...brandKit.colors, container: color } })}
              label="Container"
              description="The content box of the email"
            />
            <ColorPickerInput
              color={brandKit.colors.accent}
              onChange={(color) => setBrandKit({ ...brandKit, colors: { ...brandKit.colors, accent: color } })}
              label="Accent"
              description="Buttons, links, and highlights"
            />
            <ColorPickerInput
              color={brandKit.colors.buttonText}
              onChange={(color) => setBrandKit({ ...brandKit, colors: { ...brandKit.colors, buttonText: color } })}
              label="Button Text"
              description="Text on buttons"
            />
            <ColorPickerInput
              color={brandKit.colors.foreground}
              onChange={(color) => setBrandKit({ ...brandKit, colors: { ...brandKit.colors, foreground: color } })}
              label="Foreground"
              description="Text and other content elements"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
