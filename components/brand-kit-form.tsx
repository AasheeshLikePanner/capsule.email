import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { BadgeInfo, Building, Palette, FileText, Users, Plus, Trash2, XCircle } from 'lucide-react';
import ColorPickerInput from "@/components/color-picker-input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useRef } from 'react';

export default function BrandKitForm({ brandKit, setBrandKit }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "primaryLogo" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandKit({
          ...brandKit,
          logos: {
            ...brandKit.logos,
            primary: reader.result,
          },
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setBrandKit({ ...brandKit, [name]: value });
    }
  };

  const handleRemoveLogo = () => {
    setBrandKit({
      ...brandKit,
      logos: {
        ...brandKit.logos,
        primary: null,
      },
    });
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };



  return (
    <div className="space-y-8 mx-auto p-4 md:p-8">
      <div id="brand-details" className="p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2"><Building size={20} /> Brand Details</div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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
          <div>
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
      <div id="legal" className="p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2"><FileText size={20} /> Legal</div>
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
          <div className="flex items-center gap-2"><Users size={20} /> Social</div>
        </div>
        <div className="space-y-4">
          {brandKit.socials && brandKit.socials.length > 0 && brandKit.socials.map((social: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={social.platform}
                onValueChange={(value) => {
                  const newSocials = [...brandKit.socials];
                  newSocials[index].platform = value;
                  setBrandKit({ ...brandKit, socials: newSocials });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Social" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="pinterest">Pinterest</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="url"
                value={social.url}
                onChange={(e) => {
                  const newSocials = [...brandKit.socials];
                  newSocials[index].url = e.target.value;
                  setBrandKit({ ...brandKit, socials: newSocials });
                }}
                className="rounded-xl flex-1"
                placeholder="Enter URL"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newSocials = brandKit.socials.filter((_: any, i: number) => i !== index);
                  setBrandKit({ ...brandKit, socials: newSocials });
                }}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            className="mx-auto block w-1/2"
            onClick={() => setBrandKit({ ...brandKit, socials: [...(brandKit.socials || []), { platform: '', url: '' }] })}
          >
            Add Social Link
          </Button>
        </div>
      </div>
      <div id="logos" className="p-6 rounded-lg shadow-sm">
        <div className="mb-4">
            <div className="flex items-center gap-2"><BadgeInfo size={20} /> Logos</div>
            <p className="text-xs text-muted-foreground">Add the logos that represent your brand.</p>
          </div>
        <div className="space-y-4 flex justify-center items-center">
            <div className="relative h-60 w-60 rounded-3xl border border-dashed flex items-center justify-center cursor-pointer bg-muted/40" onClick={handleLogoClick}>
              {brandKit.logos?.primary ? (
                <>
                  <img src={brandKit.logos.primary} alt="Brand Logo" className="h-full w-full object-contain rounded-3xl" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering file input
                      handleRemoveLogo();
                    }}
                  >
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-accent rounded-3xl">
                  <span className="text-white text-4xl font-bold">
                    {brandKit.kitName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <Input id="primaryLogo" type="file" className="hidden" ref={fileInputRef} onChange={handleInputChange} name="primaryLogo"/>
            </div>
          </div>
      </div>
      <div id="colors" className="p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2"><Palette size={20} /> Colors</div>
        </div>
        <div className="grid grid-cols-2 items-center justify-items-center gap-8 min-h-[300px] mt-8">
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
  );
}
