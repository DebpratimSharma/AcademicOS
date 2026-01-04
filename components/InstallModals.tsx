import {
  Smartphone,
  Share,
  MoreVertical,
  Download,
  PlusSquare,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InstallModals = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-foreground/70 hover:border-foreground text-sm bg-wh px-3 py-1.5 rounded-md border border-white/50">
          <Download size={14} />
          <span className="hidden md:flex">Install App</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center border border-border shadow-inner">
                  <Smartphone className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    Install Academic OS
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add to your home screen for full access
                  </p>
                </div>
              </div>
              <DialogClose />
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="android"
          className="w-full flex-1 items-center justify-center"
        >
          <TabsList className="w-full bg-transparent p-1 flex justify-center gap-2 border rounded-full">
            <TabsTrigger value="android">Android</TabsTrigger>
            <TabsTrigger value="ios">iOS</TabsTrigger>
          </TabsList>
          <TabsContent
            value="android"
            className="w-full pt-1 animate-in slide-in-from-right-4 fade-in duration-300 space-y-3"
          >
           <div className="flex gap-3 w-full">
              <div className="bg-card p-5 rounded-lg border-border border">
                <span>1.</span>
              </div>
              <div className="flex w-full items-center gap-4 p-3 rounded-xl bg-card border border-border transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1C1C1E] rounded-lg text-[#00ff99]">
                  <MoreVertical size={20} />
                </div>
                <div className="text-sm text-foreground/60 leading-relaxed">
                  Tap the <span className="font-bold text-foreground">Menu</span> (3 dots) in the browser corner.
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <div className="bg-card p-5 rounded-lg border-border border">
                <span>2.</span>
              </div>
              <div className="flex w-full items-center gap-4 p-3 rounded-xl bg-card border border-border transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1C1C1E] rounded-lg text-zinc-400">
                  <Download size={20} />
                </div>
                <div className="text-sm text-foreground/60 leading-relaxed">
                  Scroll down and tap {" "}
                  <span className="font-bold text-foreground">
                    Add to Home Screen.
                  </span>
                </div>
              </div>
            </div> 
          </TabsContent>
          <TabsContent
            value="ios"
            className="w-full pt-1 animate-in slide-in-from-left-4 fade-in duration-300 space-y-3"
          >
            <div className="flex gap-2 w-full">
              <div className="bg-card p-5 rounded-lg border-border border">
                <span>1.</span>
              </div>
              <div className="flex w-full items-center gap-4 p-3 rounded-xl bg-card border border-border transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1C1C1E] rounded-lg text-[#007AFF]">
                  <Share size={20} />
                </div>
                <div className="text-sm text-foreground/60 leading-relaxed">
                  Tap the <span className="font-bold text-foreground">Share</span>{" "}
                  button in the Safari menu bar.
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="bg-card p-5 rounded-lg border-border border">
                <span>2.</span>
              </div>
              <div className="flex w-full items-center gap-4 p-3 rounded-xl bg-card border border-border transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1C1C1E] rounded-lg text-zinc-400">
                  <PlusSquare size={20} />
                </div>
                <div className="text-sm text-foreground/60 leading-relaxed">
                  Scroll down and tap{" "}
                  <span className="font-bold text-foreground">
                    Add to Home Screen.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InstallModals;
