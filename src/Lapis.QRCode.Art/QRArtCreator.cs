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
                int dd = (10*maxD-15*maxD)*2/maxD;
                for (var i=minY-blurRadius;i<maxY+blurRadius;i++){
                	for (var ii=minX-blurRadius;ii<maxX+blurRadius;ii++){
                		if (tripMatrix[i,ii] == 0){
                			tripMatrix[i,ii] = dd;
                		}
                	}
                }
                //TripMatrixDrawer.THeight = (maxY+blurRadius) - (minY-blurRadius);
                //TripMatrixDrawer.TWidth = (maxX+blurRadius) - (minX-blurRadius);
                
                stopWatch.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan ts = stopWatch.Elapsed;
				
				// Format and display the TimeSpan value.
				string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					ts.Hours, ts.Minutes, ts.Seconds,
					ts.Milliseconds / 10);
				Console.WriteLine("QRArtCreatorTime " + elapsedTime);
                
                getEdgeDistance(tripMatrix, out TripMatrix outMatrix);
                //return TripMatrixDrawer.Draw(tripMatrix);
                return TripMatrixDrawer.Draw(outMatrix);
            }
            else {
            	return null;
            }
        }
        public static void getEdgeDistance(TripMatrix tripMatrix, out TripMatrix outMatrix) {
        	int theight = tripMatrix.RowCount;
        	int twidth = tripMatrix.ColumnCount;
        	outMatrix = new TripMatrix(theight,twidth);
        	Console.WriteLine("outW: "+outMatrix.ColumnCount+" outH: "+outMatrix.RowCount);
        	Dictionary<int, int> circledicttemp = new Dictionary<int, int>();

			Stopwatch stopWatch = new Stopwatch();
        	stopWatch.Start();
        	int ystep = 1 + outMatrix.RowCount / 200;
        	int xstep = 1 + outMatrix.ColumnCount / 200;
        	int maxmaxr = 0;
        	long sumr = 0;
        	int nr = 0;
        	for (var i=0;i<theight;i+=ystep){
				for (var ii=0;ii<twidth;ii+=xstep){
					if (tripMatrix[i,ii] > 0){ //first is row, second is col
						int mindist1 = twidth*twidth+theight*theight;//radius/diameter? of largest circle centered at point
						//int mindist2 = twidth*twidth+theight*theight;//radius/diameter? of largest circle containing point
						double sumdist = 0;
						
						double pct = 50.0;
						int maxi = 1;
						int maxii = 1;
						int mini = 1;
						int minii = 1;
						for (var iii=1;iii<theight;iii+=ystep){
							if (i+iii >= theight || tripMatrix[i+iii,ii]<=0){
								maxi = iii;
								break;
							}
						}
						mindist1 = maxi;
						for (var iii=1;iii<theight;iii+=ystep){
							if (i-iii <0 || tripMatrix[i-iii,ii]<=0){
								mini = iii;
								break;
							}
						}
						if (mini < mindist1){
							mindist1 = mini;
						}
						for (var iii=1;iii<twidth;iii+=xstep){
							if (ii+iii >= twidth || tripMatrix[i,ii+iii]<=0){
								maxii = iii;
								break;
							}
						}
						if (maxii < mindist1){
							mindist1 = maxii;
						}
						for (var iii=1;iii<twidth;iii+=xstep){
							if (ii-iii < 0 || tripMatrix[i,ii-iii]<=0){
								minii = iii;
								break;
							}
						}
						if (minii < mindist1){
							mindist1 = minii;
						}
						int d = mindist1*mindist1;
						int od = mindist1*mindist1;
						for (var iii=-1*mindist1+1;iii<mindist1;iii+=ystep){
							for (var iiii=-1*mindist1+1;iiii<mindist1;iiii+=xstep){
								if (i+iii >=0 && i+iii < theight){
									if (ii+iiii >=0 && ii+iiii < twidth){
										if (tripMatrix[i+iii,ii+iiii]<=0){
											if (iii*iii+iiii*iiii<d){
												d = iii*iii+iiii*iiii;
											}
										}
									}
									else {
										if (iii*iii+iiii*iiii<d){
											d = iii*iii+iiii*iiii;
										}
									}
								}
								else {
									if (iii*iii+iiii*iiii<d){
										d = iii*iii+iiii*iiii;
									}
								}
								
							}
						}
						circledicttemp[i*twidth+ii]=d;
						if (d>maxmaxr){maxmaxr = d;}
						sumr += d;
						nr++;
						/*
						int dd = d;
						mindist1 = twidth*twidth+theight*theight;
						
						for (d=-45;d<45;d++){
							int iii = 1; bool isBlack = true;
							int distr = 0;
							while (isBlack){
								double rad = 3.14159265/180;
								rad *= d;
								int h = Convert.ToInt32(Math.Tan(rad)*iii);
								
								if (i+h<0 || i+h>=theight || ii+iii>=twidth ||  tripMatrix[i+h,ii+iii]<=0){
									isBlack = false;
									distr = iii*iii+h*h;
								}
								iii++;
							}
							
							iii = 1; isBlack = true;
							int distl = 0;
							while (isBlack){
								double rad = 3.14159265/180;
								rad *= d;
								int h = Convert.ToInt32(Math.Tan(rad)*iii);
								
								if (i-h>=theight || i-h<0 || ii-iii<0 ||  tripMatrix[i-h,ii-iii]<=0){
									isBlack = false;
									distl = iii*iii+h*h;
								}
								iii++;
							}
							distr--;
							distl--;
							
							if (distl == 0 || distr == 0){
								mindist1 = 0;
								break;
							}
							if (distl<mindist1){
								mindist1 = distl;
							}
							if (distr<mindist1){
								mindist1 = distr;
							}
						}
						if (mindist1 > 0){
							for (d=45;d<135;d++){
								int iii = 1; bool isBlack = true;
								int distu = 0;
								while (isBlack){
									double rad = 3.14159265/180;
									rad *= d;
									int w = Convert.ToInt32(Math.Cos(rad)/Math.Sin(rad)*iii);
								
									if (ii+w<0 || ii+w>=twidth || i-iii<0 ||  tripMatrix[i-iii,ii+w]<=0){
										isBlack = false;
										distu = iii*iii+w*w;
									}
									iii++;
								}
							
								iii = 1; isBlack = true;
								int distd = 0;
								while (isBlack){
									double rad = 3.14159265/180;
									rad *= d;
									int w = Convert.ToInt32(Math.Cos(rad)/Math.Sin(rad)*iii);
								
									if (ii+w<0 || ii+w>=twidth || i+iii>=theight ||  tripMatrix[i+iii,ii-w]<=0){
										isBlack = false;
										distd = iii*iii+w*w;
									}
									iii++;
								}
								distu--;
								distd--;
							
								if (distu==0 || distd == 0){
									mindist1 = 0;
									break;
								}
								if (distu<mindist1){
									mindist1 = distu;
								}
								if (distd<mindist1){
									mindist1 = distd;
								}
							}
						}
						
						circledict[i*twidth+ii]=mindist1+1;
						if (mindist1+1 != dd){
							Console.WriteLine("d: "+dd+" md: "+(mindist1+1)+" od: "+od);
						}
						*/
						
					}
					else {
						circledicttemp[(i)*twidth+ii]=0;
					}
				}
			}
			double avgr = sumr;
			avgr /= nr;
			int avgavgr = Convert.ToInt32(avgr);
			Dictionary<int, int> circledict = new Dictionary<int, int>();

        	for (var i=0;i<theight;i+=ystep){
				for (var ii=0;ii<twidth;ii+=xstep){
					if (tripMatrix[i,ii] > 0){ //first is row, second is col
						if (i-ystep>=0 && ii-xstep >= 0 && i+ystep <theight && ii+xstep<twidth){
							int a = circledicttemp[(i-ystep)*twidth+ii-xstep];
							a += circledicttemp[(i+ystep)*twidth+ii-xstep];
							a += circledicttemp[(i-ystep)*twidth+ii+xstep];
							a += circledicttemp[(i+ystep)*twidth+ii+xstep];
							
							int b = circledicttemp[(i-ystep)*twidth+ii];
							b += circledicttemp[(i+ystep)*twidth+ii];
							b += circledicttemp[(i)*twidth+ii-xstep];
							b += circledicttemp[(i)*twidth+ii+xstep];
							
							circledict[i*twidth+ii]=(a+2*b+4*circledicttemp[i*twidth+ii])/12;
						}
						else {
							circledict[i*twidth+ii]=circledicttemp[i*twidth+ii];
						}
						
					}
				}
			}
			if (ystep > 1 || xstep > 1){
				for (var yoffset=0;yoffset<ystep;yoffset++){
					for (var xoffset=0;xoffset<xstep;xoffset++){
						if (yoffset==0 && xoffset ==0){
							continue;
						}
						for (var i=yoffset;i<theight;i+=ystep){
							for (var ii=xoffset;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){ //first is row, second is col
									int tlval = 1;
									int trval = 1;
									int blval = 1;
									int brval = 1;
									int val1;
									if (circledict.TryGetValue((i-yoffset)*twidth+ii-xoffset, out val1)) {
										tlval = val1;
									}
									else {
										tlval = 1;
									}
									

									if (circledict.TryGetValue((i+ystep-yoffset)*twidth+ii-xoffset, out val1)) {
										blval = val1;
									}
									else {
										blval = 1;
									}

									if (circledict.TryGetValue((i+ystep-yoffset)*twidth+ii+xstep-xoffset, out val1)) {
										brval = val1;
									}
									else {
										brval = 1;
									}
									
									if (circledict.TryGetValue((i-yoffset)*twidth+ii+xstep-xoffset, out val1)) {
										trval = val1;
									}
									else {
										trval = 1;
									}
									
									if (ii+xstep-xoffset >= twidth){
										trval = 1;
										brval = 1;
									}
									if (i+ystep-yoffset >= theight){
										blval = 1;
										brval = 1;
									}
									
									if (yoffset ==0 ){
										circledict[i*twidth+ii]=(tlval+trval)/2;
									}
									else if (xoffset ==0 ){
										circledict[i*twidth+ii]=(tlval+blval)/2;
									}
									else {
										circledict[i*twidth+ii]=(tlval+trval+blval+brval)/4;
									}
									
								}
							}
						}
					}
				}
			}
			//end of setting the dict
			stopWatch.Stop();
			// Get the elapsed time as a TimeSpan value.
			TimeSpan ts = stopWatch.Elapsed;
			
			// Format and display the TimeSpan value.
			string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
				ts.Hours, ts.Minutes, ts.Seconds,
				ts.Milliseconds / 10);
			Console.WriteLine("Set circledict: " + elapsedTime);
			
			stopWatch = new Stopwatch();
        	stopWatch.Start();
        	//xstep = 1;
			for (var i=0;i<theight;i+=ystep){
				for (var ii=0;ii<twidth;ii+=xstep){
					if (tripMatrix[i,ii] > 0){ //first is row, second is col
						int minr = 0;
						
						bool stillpossible = true;
						int iii = 1;
						int testmini = 0;
						int testminii = 0;
						int testmaxi = theight;
						int testmaxii = twidth;
						int testi = 0;
						int testii = 0;
						while (stillpossible){
							testi = i+iii;
							testii = ii;
							if (testi>=theight){
								stillpossible = false;
								testmaxi = iii;
							}
							else if (tripMatrix[testi,testii]<= 0){
								stillpossible = false;
								testmaxi = iii;
							}
							iii++;
						}
						stillpossible = true;
						iii = 1;
						while (stillpossible){
							testi = i-iii;
							testii = ii;
							if (testi< 0){
								stillpossible = false;
								testmini = -1*iii;
							}
							else if (tripMatrix[testi,testii]<= 0){
								stillpossible = false;
								testmini = -1*iii;
							}
							iii++;
						}
						stillpossible = true;
						iii = 1;
						while (stillpossible){
							testi = i;
							testii = ii+iii;
							if (testii >=twidth){
								stillpossible = false;
								testmaxii = iii;
							}
							else if (tripMatrix[testi,testii]<= 0){
								stillpossible = false;
								testmaxii = iii;
							}
							iii++;
						}
						stillpossible = true;
						iii = 1;
						while (stillpossible){
							testi = i;
							testii = ii-iii;
							if (testii < 0){
								stillpossible = false;
								testminii = -1*iii;
							}
							else if (tripMatrix[testi,testii]<= 0){
								stillpossible = false;
								testminii = -1*iii;
							}
							iii++;
						}
						
						int maxri = testmini*testmini;
						if (testmaxi > -1*testmini){
							maxri = testmaxi*testmaxi;
						}
						int maxrii = testminii*testminii;
						if (testmaxii > -1*testminii){
							maxrii = testmaxii*testmaxii;
						}
						int maxr = maxri+maxrii;
						
						for (iii=testmini/2;iii<testmaxi/2+1;iii+=ystep){
							for (var iiii=testminii/2;iiii<testmaxii/2+1;iiii+=xstep){
								if (circledict.TryGetValue((i+iii)*twidth+ii+iiii, out int outval)) {
									if (outval > iiii*iiii+iii*iii && outval > minr){
										minr = outval;
									}
								}
							}
						}
						
						if (minr == 0){
							outMatrix[i,ii]=-100;
						}
						else if (circledict.TryGetValue(i*twidth+ii, out int outval)) {
							outMatrix[i,ii]=(10+outval)*-125/(13+avgavgr/4+minr);
							//outMatrix[i,ii]=outval*-100/(maxmaxr);
							//outMatrix[i,ii]=minr*-100/(maxmaxr);
							if (outMatrix[i,ii]<-100){
								outMatrix[i,ii]=-100;
							}
							else if (outMatrix[i,ii]>-1){
								outMatrix[i,ii]=-1;
							}
						}
						else {
							outMatrix[i,ii]=-101;
						}
						
						
						
					
						/*
						int minr = 0;
						//int maxr = twidth*twidth+theight*theight;
						if (circledict.TryGetValue(i*twidth+ii, out int outval)) {
							minr = outval;
						}
						int radius = minr + (maxr+1-minr)/2;
						bool stillpossible  = true;
						int testi = 0;
						int testii = 0;
						
						int testmini = 0;
						int testminii = 0;
						int testmaxi = theight;
						int testmaxii = twidth;
						bool foundone = false;
						while (stillpossible){
							//if (radius > maxr){stillpossible = false; break;}
							if (radiusdict.TryGetValue(radius, out List<int[]> outlist)) {
								foundone = false;
								foreach (int[] intpair in outlist){
									testi = intpair[0];
									testii = intpair[1];
									if (circledict.TryGetValue(testi*twidth+testii, out int outval)) {
										if (outval >= radius){
											minr = outval;
											foundone = true;
										}
										else {
											if (testi < i){
												if 
											}
										}
									}
								}
							}
							else {
								radius++;
								continue;
							}
							
							
							
							maxr =
							minr = 
							radius = minr + (maxr+1-minr)/2;
						}
						for (var radius=minr+1;radius<)
						*/
					}
					else {
						outMatrix[i,ii]=-101;
					}
					
					
				}
			}
			/*
			for (var i=0;i<theight;i+=ystep){
				for (var ii=0;ii<twidth;ii+=xstep){
					if (tripMatrix[i,ii] > 0){ //first is row, second is col
						if (i-ystep>=0 && ii-xstep >= 0 && i+ystep <theight && ii+xstep<twidth){
							int a = outMatrix[(i-ystep),ii-xstep];
							a += outMatrix[(i+ystep),ii-xstep];
							a += outMatrix[(i-ystep),ii+xstep];
							a += outMatrix[(i+ystep),ii+xstep];
							
							int b = outMatrix[(i-ystep),ii];
							b += outMatrix[(i+ystep),ii];
							b += outMatrix[(i),ii-xstep];
							b += outMatrix[(i),ii+xstep];
							
							outMatrix[i,ii]=(a+2*b+4*outMatrix[i,ii])/12;
						}
						else {
							outMatrix[i,ii]=outMatrix[i,ii];
						}
						
					}
				}
			}*/
			
			if (ystep > 1 || xstep > 1){
				for (var yoffset=0;yoffset<ystep;yoffset++){
					for (var xoffset=0;xoffset<xstep;xoffset++){
						if (yoffset==0 && xoffset ==0){
							continue;
						}
						for (var i=yoffset;i<theight;i+=ystep){
							for (var ii=xoffset;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){ //first is row, second is col
								
									
									int tlval = -100;
									int trval = -100;
									int blval = -100;
									int brval = -100;
									int val1;
									
									tlval = outMatrix[i-yoffset,ii-xoffset];
									
									
									
									if (ii+xstep-xoffset >= twidth){
										trval = -100;
										brval = -100;
										if (i+ystep-yoffset >= theight) {
											blval = -100;
										}
										else {
											blval = outMatrix[i+ystep-yoffset,ii-xoffset];
										}
									}
									else {
										trval = outMatrix[i-yoffset,ii+xstep-xoffset];
										if (i+ystep-yoffset >= theight){
											blval = -100;
											brval = -100;
										}
										else {
											blval = outMatrix[i+ystep-yoffset,ii-xoffset];
											brval = outMatrix[i+ystep-yoffset,ii+xstep-xoffset];
										}
									}
									
									
									if (yoffset ==0 ){
										outMatrix[i,ii]=(tlval+trval)/2;
									}
									else if (xoffset ==0 ){
										outMatrix[i,ii]=(tlval+blval)/2;
									}
									else {
										outMatrix[i,ii]=(tlval+trval+blval+brval)/4;
									}
									if (outMatrix[i,ii]<-100){
										outMatrix[i,ii]=-100;
									}
									else if (outMatrix[i,ii]>-1){
										outMatrix[i,ii]=-1;
									}
									
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
					}
				}
			}
			
			stopWatch.Stop();
			// Get the elapsed time as a TimeSpan value.
			ts = stopWatch.Elapsed;
			
			// Format and display the TimeSpan value.
			elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
				ts.Hours, ts.Minutes, ts.Seconds,
				ts.Milliseconds / 10);
			Console.WriteLine("Set outMatrix: " + elapsedTime);
        }
    }
}
