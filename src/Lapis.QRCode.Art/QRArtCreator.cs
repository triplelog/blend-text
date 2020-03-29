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
        IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText, string imagePath);
    }

    public class QRArtCreator : IQRArtCreator
    {
        public QRArtCreator(
            IBinarizer binarizer, ITriparizer triparizer, IColorizer colorizer, IMerger merger,
            ITripMatrixDrawer tripMatrixDrawer)
        {
            if (binarizer == null)
                throw new ArgumentNullException(nameof(binarizer));
            if (colorizer == null)
                throw new ArgumentNullException(nameof(colorizer));
            if (triparizer == null)
                throw new ArgumentNullException(nameof(triparizer));
            if (merger == null)
                throw new ArgumentNullException(nameof(merger));
            Binarizer = binarizer;
            Triparizer = triparizer;
            Colorizer = colorizer;
            Merger = merger;
            TripMatrixDrawer = tripMatrixDrawer;
        }

        public IQRCodeEncoder QRCodeEncoder { get; }

        public IBinarizer Binarizer { get; }
        
        public ITriparizer Triparizer { get; }
        
        public IColorizer Colorizer { get; }

        public IMerger Merger { get; }
        
        public ITripMatrixDrawer TripMatrixDrawer { get; }

        public virtual IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText, string imagePath)
        {
        	

            if (image != null) //text on image
            {
            	int twidth = (int)imageText.Width;
            	int theight = (int)imageText.Height;
        		//image.Height, image.Width
                var imgColorMatrix = Colorizer.Colorize(image, theight,twidth);
                var tripMatrix = new TripMatrix(theight,twidth);
        		
                for (var i=0;i<theight;i++){
                	for (var ii=0;ii<twidth;ii++){
                		tripMatrix[i,ii] = 0; //first is row, second is col
                	}
                }//~20 ms since else if
                
                
				
				Stopwatch stopWatch = new Stopwatch();
        		stopWatch.Start();
				
                for (var i=0;i<theight;i++){
                	for (var ii=0;ii<twidth;ii++){
                		if (imageText.GetPixel(ii,i) < 12000000){//first is x (col), second is y
                			tripMatrix[i,ii] = 1;
                		}
                		if (imageText.GetPixel(ii,i) < 8000000){
                			tripMatrix[i,ii] = 2;
                		}
                		if (imageText.GetPixel(ii,i) < 4000000){
                			tripMatrix[i,ii] = 3;
                		}
                	}
                }//~110 ms for this double loop
				
				
				
				
        		
                for (var i=10;i<theight-10;i++){
                	for (var ii=10;ii<twidth-10;ii++){
                		
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
                
                
                return TripMatrixDrawer.Draw(tripMatrix, imgColorMatrix, imagePath);
            }
            else {
            	return null;
            }
        }
    }
}
