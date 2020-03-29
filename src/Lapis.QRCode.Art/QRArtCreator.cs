using Lapis.QRCode.Encoding;
using Lapis.QRCode.Imaging;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lapis.QRCode.Art
{
    public interface IQRArtCreator
    {
        IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText);
    }

    public class QRArtCreator : IQRArtCreator
    {
        public QRArtCreator(
            IQRCodeEncoder qrCodeEncoder,
            IBinarizer binarizer, ITriparizer triparizer, IColorizer colorizer, IMerger merger,
            IBitMatrixDrawer bitMatrixDrawer, ITripMatrixDrawer tripMatrixDrawer)
        {
            if (qrCodeEncoder == null)
                throw new ArgumentNullException(nameof(qrCodeEncoder));
            if (binarizer == null)
                throw new ArgumentNullException(nameof(binarizer));
            if (colorizer == null)
                throw new ArgumentNullException(nameof(colorizer));
            if (triparizer == null)
                throw new ArgumentNullException(nameof(triparizer));
            if (merger == null)
                throw new ArgumentNullException(nameof(merger));
            if (bitMatrixDrawer == null)
                throw new ArgumentNullException(nameof(bitMatrixDrawer));
            QRCodeEncoder = qrCodeEncoder;
            Binarizer = binarizer;
            Triparizer = triparizer;
            Colorizer = colorizer;
            Merger = merger;
            BitMatrixDrawer = bitMatrixDrawer;
            TripMatrixDrawer = tripMatrixDrawer;
        }

        public IQRCodeEncoder QRCodeEncoder { get; }

        public IBinarizer Binarizer { get; }
        
        public ITriparizer Triparizer { get; }
        
        public IColorizer Colorizer { get; }

        public IMerger Merger { get; }

        public IBitMatrixDrawer BitMatrixDrawer { get; }
        
        public ITripMatrixDrawer TripMatrixDrawer { get; }

        public virtual IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText)
        {
        	
            var bitMatrix = QRCodeEncoder.Build(data); //~20 ms
            
            
				
            if (image != null && 2 == 3) //qr code
            {
                int moduleCount = bitMatrix.Size;
                var imgBitMatrix = Binarizer.Binarize(image, moduleCount * 3, moduleCount * 3);
                var imgColorMatrix = Colorizer.Colorize(image, moduleCount * 3, moduleCount * 3);
                //var imgColorMatrix = new ColorSquare(moduleCount * 3);
                bitMatrix = Merger.Merge(bitMatrix, QRCodeEncoder.TypeNumber, imgBitMatrix);
                return BitMatrixDrawer.Draw(bitMatrix, imgColorMatrix);
            }
            else if (image != null) //text on image
            {
            	
        		
                int moduleCount = bitMatrix.Size;
                var imgColorMatrix = Colorizer.Colorize(image, moduleCount * 3, moduleCount * 3);
                var tripMatrix = new TripSquare(500);
        		
                for (var i=0;i<500;i++){
                	for (var ii=0;ii<500;ii++){
                		tripMatrix[i,ii] = 0;
                	}
                }//~20 ms since else if
                
                
				
				Stopwatch stopWatch = new Stopwatch();
        		stopWatch.Start();
				
                for (var i=5;i<495;i++){
                	for (var ii=5;ii<495;ii++){
                		if (imageText.GetPixel(i,ii) < 12000000){
                			tripMatrix[ii,i] = 1;
                		}
                		if (imageText.GetPixel(i,ii) < 8000000){
                			tripMatrix[ii,i] = 2;
                		}
                		if (imageText.GetPixel(i,ii) < 4000000){
                			tripMatrix[ii,i] = 3;
                		}
                	}
                }//~110 ms for this double loop
				
				
				
				
        		
                for (var i=10;i<500-10;i++){
                	for (var ii=10;ii<500-10;ii++){
                		/*
                		if (tripMatrix[i,ii] == 0){
                			var minDist = 999;
                			for (var iii=i-10;iii<i+11;iii++){
								for (var iiii=ii-10;iiii<ii+11;iiii++){
									if (tripMatrix[iii,iiii] > 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if (d< minDist){
											minDist = d;
										}
									}
								}
							}
							if (minDist < 51){
								tripMatrix[i,ii] = (2*minDist-150)/5;
							}
                		}
                		*/
                		
                		if (tripMatrix[i,ii] > 0){
                			for (var iii=i-10;iii<i+11;iii++){
								for (var iiii=ii-10;iiii<ii+11;iiii++){
									if (tripMatrix[iii,iiii] == 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if ( d < 51){
										tripMatrix[iii,iiii] = (2*d-150)/5;
										}
									}
									else if (tripMatrix[iii,iiii] < 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if ( d < 51 ){
											var dd = (2*d-150)/5;
											if (dd < tripMatrix[iii,iiii]) {
												tripMatrix[iii,iiii] = dd;
											}
										}
									}
								}
							}
                		}
                		
                	}
                }
                
                stopWatch.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan ts = stopWatch.Elapsed;
				
				// Format and display the TimeSpan value.
				string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					ts.Hours, ts.Minutes, ts.Seconds,
					ts.Milliseconds / 10);
				Console.WriteLine("QRArtCreatorTime " + elapsedTime);
                
                
                return TripMatrixDrawer.Draw(tripMatrix, imgColorMatrix);
            }
            else {
            	Console.Out.WriteLine("no image");
            	var imgMatrix = new ColorSquare(bitMatrix.Size * 3);
            	return BitMatrixDrawer.Draw(bitMatrix, imgMatrix);
            }
        }
    }
}
