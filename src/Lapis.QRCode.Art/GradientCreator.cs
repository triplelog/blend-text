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
    public interface GradientRCreator
    {
        IImage Create(IRgb24BitmapBase gradientImage, int narrowQuotient);
    }

    public class GradientCreator : GradientRCreator
    {
        public GradientCreator(
            ITriparizer triparizer, ITripMatrixDrawer tripMatrixDrawer)
        {
            if (triparizer == null)
                throw new ArgumentNullException(nameof(triparizer));
            Triparizer = triparizer;
            TripMatrixDrawer = tripMatrixDrawer;
        }
        
        public ITriparizer Triparizer { get; }
        
        public ITripMatrixDrawer TripMatrixDrawer { get; }

        public virtual IImage Create(IRgb24BitmapBase gradientImage, int narrowQuotient)
        {
        	

            if (gradientImage != null) //text on image
            {
            	int twidth = (int)gradientImage.Width;
            	int theight = (int)gradientImage.Height;
            	
            	Stopwatch stopWatch = new Stopwatch();
        		stopWatch.Start();
        		
                var tripMatrix = new TripMatrix(theight,twidth);
                
                for (var i=0;i<theight;i++){
                	for (var ii=0;ii<twidth;ii++){
                		tripMatrix[i,ii] = 0; //first is row, second is col
                	}
                }//~20 ms since else if
                
                
				
				
				
				int p;
                for (var i=0;i<theight;i++){
                	for (var ii=0;ii<twidth;ii++){
                		p = gradientImage.GetPixel(ii,i);
                		
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
                
				
                
                stopWatch.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan ts = stopWatch.Elapsed;
				
				// Format and display the TimeSpan value.
				string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					ts.Hours, ts.Minutes, ts.Seconds,
					ts.Milliseconds / 10);
				Console.WriteLine("GradientCreatorTime " + elapsedTime);
                
                getEdgeDistance(tripMatrix, narrowQuotient, out TripMatrix outMatrix);
                //return TripMatrixDrawer.Draw(tripMatrix);
                return TripMatrixDrawer.Draw(outMatrix);
            }
            else {
            	return null;
            }
        }
        public static void getEdgeDistance(TripMatrix tripMatrix, int narrowQuotient, out TripMatrix outMatrix) {
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
        	int narrowFactor = (10+maxmaxr)*10/narrowQuotient;
			int narrowAdj = (10+maxmaxr+narrowFactor)*-100/(10+maxmaxr);
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
							
							outMatrix[i,ii]=(10+outval)*narrowAdj/(10+minr+narrowFactor);
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
