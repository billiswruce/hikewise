export const compressImage = async (
  imageFile: File, 
  maxWidth: number = 700, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleSize = maxWidth / img.width;
        
        // Om bilden är mindre än maxWidth, behåll originalstorleken
        if (scaleSize > 1) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
        }

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Konvertera till WebP med angiven kvalitet
        const compressedImage = canvas.toDataURL('image/webp', quality);
        resolve(compressedImage);
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
}; 