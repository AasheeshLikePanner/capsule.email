import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { BadgeInfo, Building, Palette, FileText, Users, Trash2, XCircle } from 'lucide-react';
import ColorPickerInput from "@/components/color-picker-input";
import { Button } from "@/components/ui/button";
import React, { useRef, useState, useEffect } from 'react';

interface BrandKitFormProps {
  brandKit: any;
  setBrandKit: React.Dispatch<React.SetStateAction<any>>;
}

export default function BrandKitForm({ brandKit, setBrandKit }: BrandKitFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (brandKit.logo_primary instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(brandKit.logo_primary);
    } else if (typeof brandKit.logo_primary === 'string') {
      setLogoPreviewUrl(brandKit.logo_primary);
    } else {
      setLogoPreviewUrl(null);
    }
  }, [brandKit.logo_primary]);

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "logo_primary" && files && files[0]) {
      setBrandKit({
        ...brandKit,
        logo_primary: files[0],
      });
    } else {
      setBrandKit({ ...brandKit, [name]: value });
    }
  };

  const handleRemoveLogo = () => {
    setBrandKit({
      ...brandKit,
      logo_primary: null,
    });
    setLogoPreviewUrl(null);
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
              <Label htmlFor="kit_name" className="text-muted-foreground">Kit Name</Label>
              <Input
                id="kit_name"
                name="kit_name"
                value={brandKit.kit_name}
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
            <Label htmlFor="brand_summary" className="text-muted-foreground">Brand Summary</Label>
            <Textarea
              id="brand_summary"
              name="brand_summary"
              value={brandKit.brand_summary}
              onChange={handleInputChange}
              className="rounded-xl h-30"
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
            <Label htmlFor="tone_of_voice" className="text-muted-foreground">Tone of Voice</Label>
            <Input
              id="tone_of_voice"
              name="tone_of_voice"
              value={brandKit.tone_of_voice}
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
          {brandKit.socials && brandKit.socials.map((socialUrl: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                name="socialUrl"
                value={socialUrl}
                onChange={(e) => {
                  const newSocials = [...brandKit.socials];
                  newSocials[index] = e.target.value;
                  setBrandKit({ ...brandKit, socials: newSocials });
                }}
                className="rounded-xl flex-1"
                placeholder="Enter Social URL"
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
            onClick={() => setBrandKit({ ...brandKit, socials: [...(brandKit.socials || []), ''] })}
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
              {logoPreviewUrl ? (
                <>
                  <img src={logoPreviewUrl} alt="Brand Logo" className="h-full w-full object-contain rounded-3xl" />
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
                    {brandKit.kit_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <Input id="primaryLogo" type="file" className="hidden" ref={fileInputRef} onChange={handleInputChange} name="logo_primary"/>
            </div>
          </div>
      </div>
      <div id="colors" className="p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2"><Palette size={20} /> Colors</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-items-center gap-8 min-h-[300px] mt-8">
          <ColorPickerInput
            color={brandKit.color_background}
            onChange={(color) => setBrandKit({ ...brandKit, color_background: color })}
            label="Background"
            description="The main background of your email"
          />
          <ColorPickerInput
            color={brandKit.color_container}
            onChange={(color) => setBrandKit({ ...brandKit, color_container: color })}
            label="Container"
            description="The content box of the email"
          />
          <ColorPickerInput
            color={brandKit.color_accent}
            onChange={(color) => setBrandKit({ ...brandKit, color_accent: color })}
            label="Accent"
            description="Buttons, links, and highlights"
          />
          <ColorPickerInput
            color={brandKit.color_button_text}
            onChange={(color) => setBrandKit({ ...brandKit, color_button_text: color })}
            label="Button Text"
            description="Text on buttons"
          />
          <ColorPickerInput
            color={brandKit.color_foreground}
            onChange={(color) => setBrandKit({ ...brandKit, color_foreground: color })}
            label="Foreground"
            description="Text and other content elements"
          />
        </div>
      </div>
    </div>
  );
}
