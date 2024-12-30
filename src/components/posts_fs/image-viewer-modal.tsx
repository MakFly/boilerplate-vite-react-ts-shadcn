import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";

interface ImageViewerModalProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewerModal({
  images,
  initialIndex,
  open,
  onOpenChange,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Position de l’image lors du drag
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Indique si on est en train de pointer/cliquer pour le drag
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Références pour mémoriser la position de départ et la dernière position du pointeur
  const startPositionRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // transform-origin (en pourcentage) pour la loupe
  const [transformOrigin, setTransformOrigin] = useState("center");

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  /**
   * Réinitialise le zoom et la position
   */
  const resetView = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setTransformOrigin("center");
  };

  /**
   * Zoom via les boutons + et -
   */
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) {
        resetView();
      }
      return newZoom;
    });
  };

  /**
   * Clic sur l’image : effet loupe
   * - Si zoomLevel === 1, on zoome (ex. x2) autour du point cliqué
   * - Sinon, on reset le zoom
   */
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    if (zoomLevel === 1) {
      const rect = imageRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      // Convertit la position cliquée en pourcentage
      const originX = (offsetX / rect.width) * 100;
      const originY = (offsetY / rect.height) * 100;
      setTransformOrigin(`${originX}% ${originY}%`);

      // Passe à un zoom de 2 (modifiable)
      setZoomLevel(2);
    } else {
      // On repasse en zoom 1
      resetView();
    }
  };

  /**
   * Pointer Down : on prépare le drag si l’image est zoomée
   */
  const handlePointerDownOnImage = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (zoomLevel <= 1) return;

    setIsPointerDown(true);
    // Sauvegarde la position de départ
    startPositionRef.current = { ...position };
    // Mémorise la position du pointeur
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    // Optionnel : capturer le pointeur pour continuer à recevoir
    // les events même si la souris sort de l’image.
    // e.currentTarget.setPointerCapture(e.pointerId);
  };

  /**
   * Pointer Move : déplace l’image si on est en drag
   */
  const handlePointerMoveOnImage = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (!isPointerDown || zoomLevel <= 1) return;

    const deltaX = e.clientX - lastPointerRef.current.x;
    const deltaY = e.clientY - lastPointerRef.current.y;

    const newX = startPositionRef.current.x + deltaX;
    const newY = startPositionRef.current.y + deltaY;

    if (containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      // On limite le déplacement pour éviter de trop sortir
      const maxX = (imageRect.width * (zoomLevel - 1)) / 2;
      const maxY = (imageRect.height * (zoomLevel - 1)) / 2;

      const clampedX = Math.max(Math.min(newX, maxX), -maxX);
      const clampedY = Math.max(Math.min(newY, maxY), -maxY);

      setPosition({ x: clampedX, y: clampedY });
    }

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  /**
   * Pointer Up : fin du drag
   */
  const handlePointerUpOnImage = (e: React.PointerEvent<HTMLImageElement>) => {
    setIsPointerDown(false);
    startPositionRef.current = { ...position };

    // Optionnel : relâcher la capture du pointeur
    // e.currentTarget.releasePointerCapture(e.pointerId);
  };

  /**
   * Changement d'image (précédente ou suivante)
   */
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetView();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetView();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetView();
        onOpenChange(isOpen);
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-white">
          {`Image ${currentIndex + 1}`}
        </DialogTitle>
      </DialogHeader>

      {/* 
        On masque le bouton "close" par défaut (celui qui est dans DialogContent),
        car on utilise le nôtre dans la barre d'outils.
      */}
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 [&>button]:hidden">
        <div
          ref={containerRef}
          className="relative w-full h-full bg-black/90 flex items-center justify-center overflow-hidden"
          style={{
            // Le conteneur a un cursor "default"
            cursor: "default",
          }}
        >
          {/* --- Contrôles en haut à droite (Zoom + / -, Fermer) --- */}
          <div className="absolute top-2 right-2 flex gap-2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleZoomIn}
              autoFocus={false}
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* --- Navigation entre les images --- */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* --- L'image elle-même --- */}
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            onClick={handleImageClick}
            // On gère tous les Pointer Events sur l'image
            onPointerDown={handlePointerDownOnImage}
            onPointerMove={handlePointerMoveOnImage}
            onPointerUp={handlePointerUpOnImage}
            onPointerLeave={handlePointerUpOnImage}
            className="max-w-[80%] max-h-[80%] w-auto h-auto object-contain select-none transition-transform duration-200"
            style={{
              // Afficher la loupe (zoom-in / zoom-out) seulement sur l'image
              cursor: zoomLevel === 1 ? "zoom-in" : "zoom-out",
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: transformOrigin,
            }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
