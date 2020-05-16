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
        IImage Create(IRgb24BitmapBase gradientImage, int narrowQuotient, string gtype, int border);
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

        public virtual IImage Create(IRgb24BitmapBase gradientImage, int narrowQuotient, string gtype, int border)
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
                
				
                
                
                int maxmaxr = 0;
                if (gtype == "edge"){
                	getEdgeDistance(tripMatrix,  out Dictionary<int, int> circledict, out maxmaxr);
                	bool checkminr = true;
                	if (narrowQuotient == 0){
                		checkminr = false;
                	}
					getEdgePercentage(tripMatrix, circledict, checkminr, maxmaxr, narrowQuotient, out TripMatrix outMatrix);

					return TripMatrixDrawer.Draw(outMatrix);
                }
                else if (gtype == "linear"){
                	//get angle
                	int angle = narrowQuotient; // from 0 to 359
                	if (angle > 359){
                		angle = angle %360;
                	}
                	else if (angle < 0){
                		angle = angle %360;
                		angle += 720;
                		angle = angle %360;
                	}
                	theight = tripMatrix.RowCount;
					twidth = tripMatrix.ColumnCount;
					TripMatrix outMatrix = new TripMatrix(theight,twidth);
        			int minr = theight*theight+twidth*twidth;
        			int maxr = 0;
                	if (angle == 0 || angle == 180){
                		//distance is x coord
                		int dd;
                		int ystep = 1;
                		int xstep = 1;
                		for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii]>0){
									if (angle == 0){
										dd = ii;
									}
									else {
										dd = twidth -1 -ii;	
									}
									if (dd<minr){minr=dd;}
									if (dd>maxr){maxr=dd;}
									outMatrix[i,ii]=dd;
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii]>0){
									outMatrix[i,ii]=(outMatrix[i,ii]-minr)*-100/(maxr-minr) - 1;
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
						return TripMatrixDrawer.Draw(outMatrix);
                	}
                	else if (angle == 90 || angle == 270){
                		//distance is y coord
                		int dd;
                		int ystep = 1;
                		int xstep = 1;
                		for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii]>0){
									if (angle == 90){
										dd = theight-1-i;
									}
									else {
										dd = i;	
									}
									if (dd<minr){minr=dd;}
									if (dd>maxr){maxr=dd;}
									outMatrix[i,ii]=dd;
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii]>0){
									outMatrix[i,ii]=(outMatrix[i,ii]-minr)*-100/(maxr-minr) - 1;
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
						return TripMatrixDrawer.Draw(outMatrix);
                	}
                	else {
                		double radians = 3.14159265/180;
                		radians *= angle;
                		//get equation of start line
                		double m = Math.Tan(radians);
                		//yy = -1/m*(xx-0)+0;
                		double x;
                		double y;
                		double xx;
                		double yy = 0;
                		double d;
                		int dd;
                		int ystep = 1;
                		int xstep = 1;
                		for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii]>0){
									x = ii;
									y = theight-1-i;
									//equation of line
									//yy = m*(xx-x)+y;
									//solve
									//-1/m*(xx)=m*(xx-x)+y;
									//-1*xx=m*m*xx-m*m*x+m*y;
									//(-1-m*m)*xx=-m*m*x+m*y;
									xx=(-m*m*x+m*y)/(-1-m*m);
									if (angle >0 && angle < 90){
										yy = -1/m*xx;
									}
									else if (angle >90 && angle < 180) {
										yy = -1/m*(xx-twidth);
									}
									else if (angle >180 && angle < 270) {
										yy = -1/m*(xx-twidth)+theight;
									}
									else if (angle >270 && angle < 360) {
										yy = -1/m*(xx)+theight;
									}
									d = (x-xx)*(x-xx)+(y-yy)*(y-yy);
									dd = Convert.ToInt32(Math.Sqrt(d));
									if (dd<minr){minr=dd;}
									if (dd>maxr){maxr=dd;}
									outMatrix[i,ii]=dd;
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii]>0){
									outMatrix[i,ii]=(outMatrix[i,ii]-minr)*-100/(maxr-minr) - 1;
								}
								else {
									outMatrix[i,ii]=-101;
								}
							}
						}
						return TripMatrixDrawer.Draw(outMatrix);
                		
                	}
                	//scan
                	//find max and get percentages
                	return TripMatrixDrawer.Draw(tripMatrix);
                }
                else if (gtype == "radial"){
                	//get center
                	string centerType = "centroid";
                	
                	string distanceType = "euclidean";
                	string skewType = "none";
                	
                	int skewX = 10;
                	int skewY = 10;
                	if (narrowQuotient% 10 == 0){
                		centerType = "centroid";
                	}
                	else if (narrowQuotient% 10 == 1){
                		centerType = "median";
                	}
                	else if (narrowQuotient% 10 == 2){
                		centerType = "box";
                	}
                	
                	if ( (narrowQuotient/ 10 )%10 == 0){
                		distanceType = "euclidean";
                	}
                	else if ((narrowQuotient/ 10)%10 == 1){
                		distanceType = "diamond";
                	}
                	else if ((narrowQuotient/ 10)%10 == 2){
                		distanceType = "square";
                	}
                	
                	if ( (narrowQuotient/ 100 )%10 == 0){
                		skewType = "none";
                	}
                	else if ((narrowQuotient/ 100)%10 == 1){
                		skewType = "median";
                	}
                	else if ((narrowQuotient/ 100)%10 == 2){
                		skewType = "box";
                	}
                	theight = tripMatrix.RowCount;
					twidth = tripMatrix.ColumnCount;
					TripMatrix outMatrix = new TripMatrix(theight,twidth);
					int avgx = 0;
					int avgy = 0;
					int ystep = 1;
					int xstep = 1;
					if (centerType == "centroid"){
						long sumx = 0;
						long sumy = 0;
						int n = 0;
						
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
									sumx += ii;
									sumy += i;
								}
							}
						}
					
						long avgxl = sumx/n;
						long avgyl = sumy/n;
						avgx = Convert.ToInt32(avgxl);
						avgy = Convert.ToInt32(avgyl);
					}
					else if (centerType == "median"){
						long sumx = 0;
						long sumy = 0;
						int n = 0;
						int medn = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
								}
							}
						}
						medn = n/2;
						n = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
									if (n==medn){
										avgy = i;
										break;
									}
								}
							}
						}
						n = 0;
						for (var ii=0;ii<twidth;ii+=xstep){
							for (var i=0;i<theight;i+=ystep){
								if (tripMatrix[i,ii] > 0){
									n++;
									if (n==medn){
										avgx = ii;
										break;
									}
								}
							}
						}
					}
					else if (centerType == "box"){
						int mini = theight;
						int minii = twidth;
						int maxi = 0;
						int maxii = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									if (i>maxi){maxi = i;}
									if (i<mini){mini = i;}
									if (ii>maxii){maxii = ii;}
									if (ii<minii){minii = ii;}
								}
							}
						}
						avgx = (maxii+minii)/2;
						avgy = (maxi+mini)/2;
					}
					
					if (skewType == "none"){
						skewX = 1;
						skewY = 1;
					}
					else if (skewType == "custom"){
						skewX = 1;
						skewY = 1;
					}
					else if (skewType == "median"){
						long sumx = 0;
						long sumy = 0;
						int n = 0;
						int medn = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
								}
							}
						}
						medn = n/3;
						n = 0;
						int y1 = 0;
						int y2 = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
									if (n==medn){
										y1 = i;
									}
									if (n==medn*2){
										y2 = i;
										break;
									}
								}
							}
						}
						n = 0;
						int x1 = 0;
						int x2 = 0;
						for (var ii=0;ii<twidth;ii+=xstep){
							for (var i=0;i<theight;i+=ystep){
								if (tripMatrix[i,ii] > 0){
									n++;
									if (n==medn){
										x1 = ii;
									}
									if (n==medn*2){
										x2 = ii;
									}
								}
							}
						}
						if (x2-x1 > y2-y1){//skewed in x direction so skewX is smaller
							skewX = 10;
							skewY = (x2-x1)*10/(y2-y1);
						}
						else {
							skewY = 10;
							skewX = (y2-y1)*10/(x2-x1);
						}
					}
					else if (skewType == "box"){
						int mini = theight;
						int minii = twidth;
						int maxi = 0;
						int maxii = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									if (i>maxi){maxi = i;}
									if (i<mini){mini = i;}
									if (ii>maxii){maxii = ii;}
									if (ii<minii){minii = ii;}
								}
							}
						}
						if (maxii+minii > maxi+mini){//skewed in x direction so skewX is smaller
							skewX = 10;
							skewY = (maxii+minii)*10/(maxi+mini);
						}
						else {
							skewY = 10;
							skewX = (maxi+mini)*10/(maxii+minii);
						}
					}
					Console.WriteLine("x: "+avgx+" y: "+avgy);
					int minr = theight*theight+twidth*twidth;
        			int maxr = 0;
        			int dd = 0;
					for (var i=0;i<theight;i+=ystep){
						for (var ii=0;ii<twidth;ii+=xstep){
							if (tripMatrix[i,ii] > 0){
								if (distanceType == "euclidean"){
									dd = Convert.ToInt32(Math.Sqrt( skewY*(i-avgy)*(i-avgy)+skewX*(ii-avgx)*(ii-avgx) ));
								}
								else if (distanceType == "diamond"){
									if (i>avgy){
										dd = skewY*(i-avgy);
									}
									else {
										dd = skewY*(avgy-i);
									}
									if (ii>avgx){
										dd += skewX*(ii-avgx);
									}
									else {
										dd += skewX*(avgx-ii);
									}
								}
								else if (distanceType == "square"){
									if (i>avgy){
										dd = skewY*(i-avgy);
									}
									else {
										dd = skewY*(avgy-i);
									}
									if (ii>avgx){
										if (skewX*(ii-avgx)>dd){
											dd = skewX*(ii-avgx);
										}
									}
									else {
										if (skewX*(avgx-ii)>dd){
											dd = skewX*(avgx-ii);
										}
									}
								}
								outMatrix[i,ii] = dd;
								if (dd>maxr){maxr=dd;}
								if (dd<minr){minr=dd;}
							}
						}
					}
					for (var i=0;i<theight;i+=ystep){
						for (var ii=0;ii<twidth;ii+=xstep){
							if (tripMatrix[i,ii]>0){
								outMatrix[i,ii]=(outMatrix[i,ii]-minr)*-100/(maxr-minr) - 1;
							}
							else {
								outMatrix[i,ii]=-101;
							}
						}
					}
					
                	//get distance from center
                	//find max and get percentages
                	return TripMatrixDrawer.Draw(outMatrix);
                }
                else if (gtype == "life"){
                	//get center
                	getEdgeDistance(tripMatrix,  out Dictionary<int, int> circledict, out maxmaxr);
                	string centerType = "centroid";
                	
                	theight = tripMatrix.RowCount;
					twidth = tripMatrix.ColumnCount;
					TripMatrix outMatrixOdd = new TripMatrix(theight,twidth);
					TripMatrix outMatrixEven = new TripMatrix(theight,twidth);
					TripMatrix outMatrix = new TripMatrix(theight,twidth);
					int avgx = 0;
					int avgy = 0;
					int ystep = 1 + tripMatrix.RowCount / 200;
        			int xstep = 1 + tripMatrix.ColumnCount / 200;
					if (centerType == "centroid"){
						long sumx = 0;
						long sumy = 0;
						int n = 0;
						
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
									sumx += ii;
									sumy += i;
								}
							}
						}
					
						long avgxl = sumx/n;
						long avgyl = sumy/n;
						avgx = Convert.ToInt32(avgxl);
						avgy = Convert.ToInt32(avgyl);
					}
					else if (centerType == "median"){
						long sumx = 0;
						long sumy = 0;
						int n = 0;
						int medn = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
								}
							}
						}
						medn = n/2;
						n = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									n++;
									if (n==medn){
										avgy = i;
										break;
									}
								}
							}
						}
						n = 0;
						for (var ii=0;ii<twidth;ii+=xstep){
							for (var i=0;i<theight;i+=ystep){
								if (tripMatrix[i,ii] > 0){
									n++;
									if (n==medn){
										avgx = ii;
										break;
									}
								}
							}
						}
					}
					else if (centerType == "box"){
						int mini = theight;
						int minii = twidth;
						int maxi = 0;
						int maxii = 0;
						for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									if (i>maxi){maxi = i;}
									if (i<mini){mini = i;}
									if (ii>maxii){maxii = ii;}
									if (ii<minii){minii = ii;}
								}
							}
						}
						avgx = (maxii+minii)/2;
						avgy = (maxi+mini)/2;
					}
					
					Console.WriteLine("x: "+avgx+" y: "+avgy);
					int nyears = narrowQuotient % 10000;
					int minr = nyears;
        			int maxr = 0;
        			int dd = 0;
        			int ln = 0;
        			int deadmin = (narrowQuotient / 10000) % 10;
        			int deadmax = (narrowQuotient / 100000) % 10;
        			int livemin = (narrowQuotient / 1000000) % 10;
        			int livemax = (narrowQuotient / 10000000) % 10;
        			for (var year=0;year<nyears;year++){
        				for (var i=0;i<theight;i+=ystep){
							for (var ii=0;ii<twidth;ii+=xstep){
								if (tripMatrix[i,ii] > 0){
									if (year == 0){
										outMatrix[i,ii] = 0;
										outMatrixEven[i,ii] = 0;
										if (circledict.TryGetValue(i*twidth+ii, out int outval)) {
											if (outval <= border){
												outMatrix[i,ii] = 1;
												outMatrixEven[i,ii] = 1;
											}
										}
										
										/*if (i-avgy < 10 && avgy-i<10){
											if (ii-avgx < 10 && avgx-ii<10){
												outMatrix[i,ii] = 1;
												outMatrixEven[i,ii] = 1;
											}
										}*/
										/*if (i%3 == ii%3){
											outMatrix[i,ii] = 1;
											outMatrixEven[i,ii] = 1;
										}*/
										
									}
									else if (circledict.TryGetValue(i*twidth+ii, out int outval) && outval <= border) {
										if (outMatrix[i,ii]==0){
											outMatrix[i,ii]=year+1;
										}
										outMatrixEven[i,ii] = 1;
										outMatrixOdd[i,ii] = 1;
									}
									else if (year%2 == 0){
										ln = 0;
										for (var iii=-1*ystep;iii<ystep+1;iii+=ystep){
											if (i+iii>0 && i+iii<theight-1){
												for (var iiii=-1*xstep;iiii<xstep+1;iiii+=xstep){
													if (ii+iiii>0 && ii+iiii<twidth-1 &&  (iii!=0 || iiii!=0) ){
														ln += outMatrixOdd[i+iii,ii+iiii];
													}
												}
											}
											if (ln>deadmax && ln>livemax){break;}
										}
										if (ln <=deadmax && ln >= deadmin && outMatrixOdd[i,ii]==0){
											outMatrixEven[i,ii]=1;
											if (outMatrix[i,ii]==0){
												outMatrix[i,ii]=year+1;
											}
											//outMatrix[i,ii]++;
										} 
										else if (ln <=livemax && ln >= livemin && outMatrixOdd[i,ii]==1){
											outMatrixEven[i,ii]=1;
											if (outMatrix[i,ii]==0){
												outMatrix[i,ii]=year+1;
											}
											//outMatrix[i,ii]++;
										}
										else {
											outMatrixEven[i,ii]=0;
										}
									}
									else if (year%2 == 1){
										ln = 0;
										for (var iii=-1*ystep;iii<ystep+1;iii+=ystep){
											if (i+iii>0 && i+iii<theight-1){
												for (var iiii=-1*xstep;iiii<xstep+1;iiii+=xstep){
													if (ii+iiii>0 && ii+iiii<twidth-1 &&  (iii!=0 || iiii!=0) ){
														ln += outMatrixEven[i+iii,ii+iiii];
													}
												}
											}
											if (ln>deadmax && ln>livemax){break;}
										}
										if (ln <=deadmax && ln >= deadmin && outMatrixEven[i,ii]==0){
											outMatrixOdd[i,ii]=1;
											if (outMatrix[i,ii]==0){
												outMatrix[i,ii]=year+1;
											}
											//outMatrix[i,ii]++;
										} 
										else if (ln <=livemax && ln >= livemin && outMatrixEven[i,ii]==1){
											outMatrixOdd[i,ii]=1;
											if (outMatrix[i,ii]==0){
												outMatrix[i,ii]=year+1;
											}
											//outMatrix[i,ii]++;
										}
										else {
											outMatrixOdd[i,ii]=0;
										}
									}
									
									
								}
								else {
									if (year == 0){
										outMatrix[i,ii] = 0;
										outMatrixOdd[i,ii] = 0;
										outMatrixEven[i,ii] = 0;
									}
								}
							}
						}
        			}
					for (var i=0;i<theight;i+=ystep){
						for (var ii=0;ii<twidth;ii+=xstep){
							if (tripMatrix[i,ii] > 0){
								dd = outMatrix[i,ii];
								
								if (dd>maxr){maxr=dd;}
								if (dd<minr){minr=dd;}
							}
						}
					}
					for (var i=0;i<theight;i+=ystep){
						for (var ii=0;ii<twidth;ii+=xstep){
							if (tripMatrix[i,ii] > 0){
								if (outMatrix[i,ii]==0){
									//outMatrix[i,ii]=maxr;
								}
							}
						}
					}
					for (var i=0;i<theight;i+=ystep){
						for (var ii=0;ii<twidth;ii+=xstep){
							if (tripMatrix[i,ii]>0){
								outMatrix[i,ii]=(outMatrix[i,ii]-minr)*-99/(maxr-minr) - 1;
							}
							else {
								outMatrix[i,ii]=-101;
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
					
                	//get distance from center
                	//find max and get percentages
                	stopWatch.Stop();
					// Get the elapsed time as a TimeSpan value.
					TimeSpan ts = stopWatch.Elapsed;
				
					// Format and display the TimeSpan value.
					string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
						ts.Hours, ts.Minutes, ts.Seconds,
						ts.Milliseconds / 10);
					Console.WriteLine("GradientLifeCreatorTime " + elapsedTime);
				
                	return TripMatrixDrawer.Draw(outMatrix);
                }
                else {
                	return TripMatrixDrawer.Draw(tripMatrix);
                }
                
            }
            else {
            	return null;
            }
        }
        public static void getEdgeDistance(TripMatrix tripMatrix, out Dictionary<int, int> circledict, out int maxmaxr) {
        	int theight = tripMatrix.RowCount;
        	int twidth = tripMatrix.ColumnCount;
        	Console.WriteLine("outW: "+tripMatrix.ColumnCount+" outH: "+tripMatrix.RowCount);
        	Dictionary<int, int> circledicttemp = new Dictionary<int, int>();
        	circledict = new Dictionary<int, int>();

			Stopwatch stopWatch = new Stopwatch();
        	stopWatch.Start();
        	int ystep = 1 + tripMatrix.RowCount / 200;
        	int xstep = 1 + tripMatrix.ColumnCount / 200;
        	maxmaxr = 0;
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
						
						
					}
					else {
						circledicttemp[(i)*twidth+ii]=0;
					}
				}
			}


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
		}
		public static void getEdgePercentage(TripMatrix tripMatrix, Dictionary<int, int> circledict, bool findminr, int maxmaxr, int narrowQuotient, out TripMatrix outMatrix) {
        	
			
			
			int theight = tripMatrix.RowCount;
        	int twidth = tripMatrix.ColumnCount;
        	outMatrix = new TripMatrix(theight,twidth);
        	int ystep = 1 + outMatrix.RowCount / 200;
        	int xstep = 1 + outMatrix.ColumnCount / 200;
        	
			Stopwatch stopWatch = new Stopwatch();
        	stopWatch.Start();
        	//xstep = 1;
        	int narrowFactor = 1;
        	int narrowAdj = 1;
        	if (findminr){
        		narrowFactor = (10+maxmaxr)*10/narrowQuotient;
				narrowAdj = (10+maxmaxr+narrowFactor)*-100/(10+maxmaxr);
			}

			for (var i=0;i<theight;i+=ystep){
				for (var ii=0;ii<twidth;ii+=xstep){
					if (tripMatrix[i,ii] > 1){ //first is row, second is col
						int minr = 0;
						if (findminr){
							
						
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
						}
						else {
						
						}
						if (findminr && minr == 0){
							outMatrix[i,ii]=-1;
						}
						else if (circledict.TryGetValue(i*twidth+ii, out int outval)) {
							if (findminr){
								outMatrix[i,ii]=(10+outval)*narrowAdj/(10+minr+narrowFactor);
							}
							else {
								outMatrix[i,ii]=outval*-100/maxmaxr;
							}
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
							outMatrix[i,ii]=-1;
						}
						
						
					}
					else {
						outMatrix[i,ii]=0;
					}
					
					
				}
			}
			
			
			
			for (var i=0;i<theight;i+=ystep){
				for (var ii=0;ii<twidth;ii+=xstep){
					if (tripMatrix[i,ii] > 1){ //first is row, second is col
						if (i-ystep>=0 && ii-xstep >= 0 && i+ystep <theight && ii+xstep<twidth){
							int a = outMatrix[(i-ystep),ii-xstep];
							a += outMatrix[(i+ystep),ii-xstep];
							a += outMatrix[(i-ystep),ii+xstep];
							a += outMatrix[(i+ystep),ii+xstep];
							
							int b = outMatrix[(i-ystep),ii];
							b += outMatrix[(i+ystep),ii];
							b += outMatrix[(i),ii-xstep];
							b += outMatrix[(i),ii+xstep];
							
							outMatrix[i,ii]=(a+2*b+4*outMatrix[i,ii])/16;
							if (outMatrix[i,ii]<-100){
								outMatrix[i,ii]=-100;
							}
							else if (outMatrix[i,ii]>-1){
								outMatrix[i,ii]=-1;
							}

						}
						else {
							outMatrix[i,ii]=outMatrix[i,ii];
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
								if (tripMatrix[i,ii] > 1){ //first is row, second is col
								
									
									int tlval = 0;
									int trval = 0;
									int blval = 0;
									int brval = 0;
									int val1;
									
									tlval = outMatrix[i-yoffset,ii-xoffset];
									
									
									
									if (ii+xstep-xoffset >= twidth){
										trval = 0;
										brval = 0;
										if (i+ystep-yoffset >= theight) {
											blval = 0;
										}
										else {
											blval = outMatrix[i+ystep-yoffset,ii-xoffset];
										}
									}
									else {
										trval = outMatrix[i-yoffset,ii+xstep-xoffset];
										if (i+ystep-yoffset >= theight){
											blval = 0;
											brval = 0;
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
									outMatrix[i,ii]=0;
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
			Console.WriteLine("Set outMatrix: " + elapsedTime);
        }
    }
}
