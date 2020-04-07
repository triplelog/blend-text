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
        IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText, string imagePath, int blurRadius);
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

        public virtual IImage Create(string data, IRgb24BitmapBase image, IRgb24BitmapBase imageText, string imagePath, int blurRadius)
        {
        	

            if (image != null) //text on image
            {
            	int twidth = (int)imageText.Width;
            	int theight = (int)imageText.Height;
            	
				//var engine = new V8ScriptEngine();
        		//V8ScriptEngine v8 = new V8ScriptEngine();
				Lua state = new Lua ();
        		
            	string scriptCode = @"function DistanceFunc (d,maxD)
        		return (20*d-15*maxD)*2/maxD
        		end
        		";
        		
        		
        		
        		
        		string arrCode = @"arr = {}
        		for i=0,999 do
        		arr[i]=i
        		end
        		function DistanceFunc (i,maxD,maxii)
        		
        		for ii=0,maxii-1 do
					d = i*i+ii*ii
					arr[ii]=(20*d-15*maxD)*2/maxD
        		end
        		return arr
        		end
        		";
        		
        		
        		state.DoString (arrCode);
				var arrFunc = state ["DistanceFunc"] as LuaFunction;
				var res = arrFunc.Call (0,10,100);
        		//Console.WriteLine("Luafunc test return "+res[0]);
        		/*string scriptCode = @"function DistanceFunc (d,maxD)
        		return -10
        		end
        		";*/
        		
        		/*
        		state.DoString (scriptCode);
				var scriptFunc = state ["DistanceFunc"] as LuaFunction;
				var res = scriptFunc.Call (1,10);
				*/
				
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
				int outval;
				Dictionary<int, int> dhash = new Dictionary<int, int>();
				
				Stopwatch stopWatchLua = new Stopwatch();
        		stopWatchLua.Start();
        		
				for (var i=0;i<1000;i++){
					//int[] arr = new int[1000];
					int maxii = 1000;
					for (var ii=0;ii<1000;ii++){
						
						int d = ii*ii + i*i;
						
						if (d <= 1000*1000/2){
							//arr[ii] = d;
							/*if (dhash.TryGetValue(d, out outval)){
							
							}
							else {
								res = scriptFunc.Call (d, maxD);
								dhash[d] = Convert.ToInt32(res[0]);
							}*/
							
						}
						else {
							maxii = ii;
							break;
						}
					}
					res = arrFunc.Call (i,maxD,maxii);
					LuaTable tab = res[0] as LuaTable;
					for (var ii=0;ii<maxii;ii++) {
						int d = ii*ii + i*i;
						if (dhash.TryGetValue(d, out outval)){
							
						}
						else {
							res = tab[ii];
							dhash[d] = Convert.ToInt32(res[0]);
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
                			
                			if (tripMatrix[i-1,ii] > 0){
                				startiii = i;
                			}
                			else {
                				startiii = i-blurRadius;
                			}
                			if (tripMatrix[i+1,ii] > 0){
                				endiii = i+1;
                			}
                			else {
                				endiii = i+blurRadius+1;
                			}
                			
                			if (tripMatrix[i,ii-1] > 0){
                				startiiii = ii;
                			}
                			else {
                				startiiii = ii-blurRadius;
                			}
                			if (tripMatrix[i,ii+1] > 0){
                				endiiii = ii+1;
                			}
                			else {
                				endiiii = ii+blurRadius+1;
                			}
                			
                			
                			for (var iii=startiii;iii<endiii;iii++){
                				int[] arr = new int[endiiii-startiiii];
                				
								for (var iiii=startiiii;iiii<endiiii;iiii++){
									arr[iiii-startiiii]=tripMatrix[iii,iiii];
									/*if (tripMatrix[iii,iiii] == 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if ( d <= maxD/2){
											tripMatrix[iii,iiii] = -10;
										}
									}*/
									
									if (tripMatrix[iii,iiii] == 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if ( d <= maxD/2){
											if (dhash.TryGetValue(d, out outval)){
												tripMatrix[iii,iiii] = outval;
											}
											else {
												tripMatrix[iii,iiii] = -30;
											}
											//res = script.Call(luaFactFunction, DynValue.NewNumber(d), DynValue.NewNumber(maxD));
											//res = scriptFunc.Call (d, maxD);
											//tripMatrix[iii,iiii] = Convert.ToInt32(res[0]);
											//tripMatrix[iii,iiii] = (20*d-15*maxD)*2/maxD;
											//tripMatrix[iii,iiii] = -10;
										}
									}
									else if (tripMatrix[iii,iiii] < 0){
										var d = (i-iii)*(i-iii)+(ii-iiii)*(ii-iiii);
										if ( d <= maxD/2 ){
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
                }
                if (minY < blurRadius){minY = blurRadius;}
                if (maxY + blurRadius >= theight){maxY = theight -blurRadius;}
                if (minX < blurRadius){minX = blurRadius;}
                if (maxX + blurRadius >= twidth){maxX = twidth -blurRadius;}
                for (var i=minY-blurRadius;i<maxY+blurRadius;i++){
                	for (var ii=minX-blurRadius;ii<maxX+blurRadius;ii++){
                		if (tripMatrix[i,ii] == 0){
                			int dd = (10*maxD-15*maxD)*2/maxD;
                			tripMatrix[i,ii] = dd;
                		}
                	}
                }
                
                //TripMatrixDrawer.THeight -= theight - (maxY+blurRadius);
                //TripMatrixDrawer.TWidth -= twidth - (maxX+blurRadius);
                
                stopWatch.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan ts = stopWatch.Elapsed;
				
				// Format and display the TimeSpan value.
				string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					ts.Hours, ts.Minutes, ts.Seconds,
					ts.Milliseconds / 10);
				Console.WriteLine("QRArtCreatorTime " + elapsedTime);
                
                
                return TripMatrixDrawer.Draw(tripMatrix, imagePath);
            }
            else {
            	return null;
            }
        }
    }
}
