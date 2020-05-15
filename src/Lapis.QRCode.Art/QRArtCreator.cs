using Lapis.QRCode.Encoding;
using Lapis.QRCode.Imaging;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

 
using NLua;

namespace Lapis.QRCode.Art
{
    public interface IQRArtCreator
    {
        IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText, int blurRadius, string DistanceFormula);
    }

    public class QRArtCreator : IQRArtCreator
    {
        public QRArtCreator(
            ITriparizer triparizer, ITripMatrixDrawer tripMatrixDrawer)
        {
            if (triparizer == null)
                throw new ArgumentNullException(nameof(triparizer));
            Triparizer = triparizer;
            TripMatrixDrawer = tripMatrixDrawer;
        }
        
        public ITriparizer Triparizer { get; }
        
        public ITripMatrixDrawer TripMatrixDrawer { get; }

        public virtual IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText, int blurRadius, string DistanceFormula)
        {
        	

            if (image != null) //text on image
            {
            	int twidth = (int)imageText.Width;
            	int theight = (int)imageText.Height;
            	

				Lua state = new Lua ();
        		
            	
        		
        		string scriptCode = DistanceFormula;
        		if (scriptCode == ""){
        			scriptCode = "function DistanceFunc (d,maxD)\nreturn -30\nend";
        		}
        		state.DoString (scriptCode);
				var scriptFunc = state ["DistanceFunc"] as LuaFunction;
				var res = scriptFunc.Call (1,10);

				
        		int minI = blurRadius;
        		int minII = blurRadius;
        		bool foundminI = false;
                for (var i=blurRadius;i<theight-blurRadius;i++){
                	if (foundminI){
                		for (var ii=blurRadius;ii<minII;ii++){
							if (imageText.GetPixel(ii,i) < 16000000){
								minII = ii;
								break;
							}
						}
                	}
                	else {
                		for (var ii=blurRadius;ii<twidth-blurRadius;ii++){
							if (imageText.GetPixel(ii,i) < 16000000){
								minI = i;
								Console.WriteLine("minI "+minI+" blurRadius "+blurRadius);
								minII = ii;
								foundminI = true;
								break;
							}
						}
                	}
                }//~20 ms since else if
                
                int blankL = minII-blurRadius;
                int blankT = minI-blurRadius;
				Console.WriteLine("Blank Left "+blankL);
				Console.WriteLine("Blank Top "+blankT);
                twidth = (int)imageText.Width;
                twidth -= blankL;
            	theight = (int)imageText.Height;
            	theight -= blankT;
            	TripMatrixDrawer.MarginL += (blankL)/2;
                TripMatrixDrawer.MarginT += (blankT)/2;
                var tripMatrix = new TripMatrix(theight,twidth);
                
                for (var i=0;i<theight;i++){
                	for (var ii=0;ii<twidth;ii++){
                		tripMatrix[i,ii] = 0; //first is row, second is col
                	}
                }//~20 ms since else if
                
                
				
				Stopwatch stopWatch = new Stopwatch();
        		stopWatch.Start();
				
				int p;
                for (var i=blurRadius;i<theight-blurRadius;i++){
                	for (var ii=blurRadius;ii<twidth-blurRadius;ii++){
                		p = imageText.GetPixel(ii+blankL,i+blankT);
                		
                		if (p < 16000000){//first is x (col), second is y
                			
                			
                			if (p < 8000000){
								if (p < 4000000){
									tripMatrix[i,ii] = 3;
								}
								else {
									tripMatrix[i,ii] = 2;
								}
							}
							else {
								tripMatrix[i,ii] = 1;
							}
							
                		}
                		
                	}
                }//~110 ms for this double loop
				
				
                TripMatrixDrawer.THeight = tripMatrix.RowCount;
            	TripMatrixDrawer.TWidth = tripMatrix.ColumnCount;
                
				int maxD = blurRadius*blurRadius;
				if (maxD == 0){maxD = 1;}
				int outval;
				Dictionary<int, int> dhash = new Dictionary<int, int>();
				
				Stopwatch stopWatchLua = new Stopwatch();
        		stopWatchLua.Start();
        		
				for (var i=0;i<blurRadius;i++){
					//int[] arr = new int[1000];
					int maxii = blurRadius;
					for (var ii=0;ii<blurRadius;ii++){
						
						int d = ii*ii + i*i;
						
						if (d <= maxD){
							//arr[ii] = d;
							if (dhash.TryGetValue(d, out outval)){
							
							}
							else {
								res = scriptFunc.Call (d, maxD);
								dhash[d] = Convert.ToInt32(res[0]);
							}
							
						}
						else {
							maxii = ii;
							break;
						}
					}
					
					
				}
				stopWatchLua.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan tsLua = stopWatchLua.Elapsed;
				
				// Format and display the TimeSpan value.
				string elapsedTimeLua = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					tsLua.Hours, tsLua.Minutes, tsLua.Seconds,
					tsLua.Milliseconds / 10);
				Console.WriteLine("LuaTime " + elapsedTimeLua);
				
        		int startiii = 0;
        		int endiii = 0;
        		int startiiii = 0;
        		int endiiii = 0;
        		int maxX = 0;
        		int minX = twidth;
        		int maxY = 0;
        		int minY = theight;
                for (var i=blurRadius;i<theight-blurRadius;i++){
                	for (var ii=blurRadius;ii<twidth-blurRadius;ii++){
                		
                		if (tripMatrix[i,ii] > 0){
                			if (i>maxY){maxY = i;}
                			if (i<minY){minY = i;}
                			if (ii>maxX){maxX = ii;}
                			if (ii<minX){minX = ii;}
                			
                			if (i==0){
                				startiii = 0;
                			}
                			else if (tripMatrix[i-1,ii] > 0){
                				startiii = i;
                			}
                			else {
                				startiii = i-blurRadius;
                			}
                			
                			if (i+1==theight){
                				endiii=i+1;
                			}
                			else if (tripMatrix[i+1,ii] > 0){
                				endiii = i+1;
                			}
                			else {
                				endiii = i+blurRadius+1;
                			}
                			
                			if (ii==0){
                				startiiii = 0;
                			}
                			else if (tripMatrix[i,ii-1] > 0){
                				startiiii = ii;
                			}
                			else {
                				startiiii = ii-blurRadius;
                			}
                			
                			if (ii+1==twidth){
                				endiiii = ii+1;
                			}
                			else if (tripMatrix[i,ii+1] > 0){
                				endiiii = ii+1;
                			}
                			else {
                				endiiii = ii+blurRadius+1;
                			}
                			
                			
                			for (var iii=startiii;iii<endiii;iii++){
								for (var iiii=startiiii;iiii<endiiii;iiii++){
									/*if (tripMatrix[iii,iiii] == 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if ( d <= maxD/2){
											tripMatrix[iii,iiii] = -10;
										}
									}*/
									
									if (tripMatrix[iii,iiii] == 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if (dhash.TryGetValue(d, out outval)){
											tripMatrix[iii,iiii] = outval;
										}
									}
									else if (tripMatrix[iii,iiii] < 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if (dhash.TryGetValue(d, out outval)){
											if (outval < tripMatrix[iii,iiii]) {
												tripMatrix[iii,iiii] = outval;
											}
										}
									}
								}
							}
                		}
                		
                	}
                }
                maxX++;
                maxY++;
                if (minY < blurRadius){minY = blurRadius;}
                if (maxY + blurRadius >= theight){maxY = theight -blurRadius;}
                if (minX < blurRadius){minX = blurRadius;}
                if (maxX + blurRadius >= twidth){maxX = twidth -blurRadius;}
                res = scriptFunc.Call (maxD, maxD);
                int dd = Convert.ToInt32(res[0]);
                for (var i=minY-blurRadius;i<maxY+blurRadius;i++){
                	for (var ii=minX-blurRadius;ii<maxX+blurRadius;ii++){
                		if (tripMatrix[i,ii] == 0){
                			tripMatrix[i,ii] = dd;
                		}
                	}
                }
                TripMatrixDrawer.THeight = (maxY+blurRadius) - (minY-blurRadius);
                TripMatrixDrawer.TWidth = (maxX+blurRadius) - (minX-blurRadius);
                
                stopWatch.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan ts = stopWatch.Elapsed;
				
				// Format and display the TimeSpan value.
				string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					ts.Hours, ts.Minutes, ts.Seconds,
					ts.Milliseconds / 10);
				Console.WriteLine("QRArtCreatorTime " + elapsedTime);
                
                return TripMatrixDrawer.Draw(tripMatrix);
            }
            else {
            	return null;
            }
        }
    }
}
