using Lapis.QRCode.Encoding;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Drawing.Imaging;
using NLua;

namespace Lapis.QRCode.Imaging.Drawing
{
    public class GraphicsTextDrawer : TripMatrixDrawerBase
    {
        public override IImage Draw(TripMatrix tripMatrix)
        {
            if (tripMatrix == null)
                throw new ArgumentNullException(nameof(tripMatrix));
			
			Stopwatch stopWatch = new Stopwatch();
        	stopWatch.Start();
        	
        	bool varD = false; bool varR= false; bool varG= false; bool varB= false;
        	bool varH= false; bool varS= false; bool varL= false;
            
			for (var i=3;i<7;i++){
				if (BlurType.Length > i){
					if (BlurType[i] == 'd'){varD = true;}
					if (BlurType[i] == 'r'){varR = true;}
					if (BlurType[i] == 'g'){varG = true;}
					if (BlurType[i] == 'b'){varB = true;}
					if (BlurType[i] == 'h'){varH = true;}
					if (BlurType[i] == 's'){varS = true;}
					if (BlurType[i] == 'l'){varL = true;}
				}
				
			}
			
			varD = true;
			varR = true;
			varG = true;
			varB = true;
			varH = true;
			varS = true;
			varL = true;
					
			
			if (BlurType[0] == 'h'){
				BlurType = "hsl";
			}
			else {
				BlurType = "rgb";
			}
			if (TextType[0] == 'h'){
				TextType = "hsl";
			}
			else {
				TextType = "rgb";
			}
			char[] usedvars = new char[4];

            int imageHeight = bmp.Height;
            int imageWidth = bmp.Width;
			
			Lua state = new Lua ();
			Bitmap bmpp = (Bitmap) new Bitmap(imageWidth,imageHeight);
            using (var graph = Graphics.FromImage(bmpp))
            {
            	graph.DrawImage(bmp, new Rectangle(0,0,bmp.Width,bmp.Height));
            	
            	BitmapData bData = bmpp.LockBits(new Rectangle(0,0,bmp.Width,bmp.Height), ImageLockMode.ReadWrite, bmpp.PixelFormat);
                byte bitsPerPixel = 32;
                Console.WriteLine(bData.PixelFormat.ToString());
                int size = bData.Stride * bData.Height;
                Console.WriteLine(bData.Stride);
                Console.WriteLine(bData.Height);
                Console.WriteLine(size);
                byte[] data = new byte[size];
                System.Runtime.InteropServices.Marshal.Copy(bData.Scan0, data, 0, size);
                for (int i = 0; i < 1; i += bitsPerPixel / 8 )
				{
					//double magnitude = 1/3d*(data[i] +data[i + 1] +data[i + 2]);
					Console.WriteLine(data[i]);
					Console.WriteLine(data[i+1]);
					Console.WriteLine(data[i+2]);
					Console.WriteLine(data[i+3]);
					//data[i] is the first of 3 bytes of color

				}
				System.Runtime.InteropServices.Marshal.Copy(data, 0, bData.Scan0, data.Length);
				bmpp.UnlockBits(bData);


                //graph.Clear(Color.FromArgb(255,255,255));
                //var foreBrush = new SolidBrush(ColorHelper.FromIntRgb24(Foreground));
                var foreBrush = new SolidBrush(Color.FromArgb(40,40,40));
                var foreBrushB = new SolidBrush(Color.FromArgb(0,0,0,0));
                
        		var foreBrushCustom = new SolidBrush(Color.FromArgb(0,0,120));
        		int startR = 0;
        		int startC = 0;
        		if (MarginT < 0){
        			startR = 0 - MarginT;
        		}
        		if (MarginL < 0){
        			startC = 0 - MarginL;
        		}
        		
				Dictionary<int, int> lighthash = new Dictionary<int, int>();
				Dictionary<int, int> darkhash = new Dictionary<int, int>();
				
        		state.DoString (BlurFormula);
        		state.DoString (TextFormula);
				var scriptFunc = state ["ScriptFunc"] as LuaFunction;
				var textFunc = state ["TextFunc"] as LuaFunction;
				int newcell =0;
				int repcell = 0;
				int newdarkcell =0;
				int repdarkcell = 0;
				
				Color pixColor;
				int imgC;
				int re; int gr; int bl;
				int outval; int newcol;
				double h; double s; double l;
				int ore; int ogr; int obl; int oimgC; int otm;
				int counter;
                for (var r = startR; r <= THeight-CellWidth && r + MarginT <= bmp.Height-CellWidth; r += CellWidth)
                {
                	ore = -1;
                	ogr = -1;
                	obl = -1;
                	oimgC = -1;
                	counter = 0;
                	otm = 0;
                    for (var c = startC; c < TWidth && c + MarginL < bmp.Width; c += CellWidth)
                    {
                    	
                        if (tripMatrix[r, c] == 0)
                        {
                        	//keep color as is
                        	if (Type == "text"){
                        		var x = MarginL + c;
                            	var y = MarginT + r;
                        		graph.FillRectangle(foreBrushB, x, y, CellWidth, CellWidth);
                        		if (counter >= 19 || otm == 0){
									ore = -1;
									ogr = -1;
									obl = -1;
									oimgC = -1;
									counter = 0;
									otm = 0;
								}
								else {
                            		counter++;
								}
                        	}
                        	else {
                        		if (counter >= 19 || otm == 0){
									ore = -1;
									ogr = -1;
									obl = -1;
									oimgC = -1;
									counter = 0;
									otm = 0;
								}
								else {
									var x = MarginL + c;
                            		var y = MarginT + r;
                            		pixColor = bmp.GetPixel(x, y);
                            
                            		foreBrushCustom.Color = Color.FromArgb(pixColor.R,pixColor.G,pixColor.B);
							
                            		graph.FillRectangle(foreBrushCustom, x, y, CellWidth, CellWidth);
                            		counter++;
								}
                        	}
                        	
                        	
                        	
                        }
                        else if (tripMatrix[r, c] > 0)
                        {
                        	if (counter >= 19 || otm == 0){
								ore = -1;
								ogr = -1;
								obl = -1;
								oimgC = -1;
								counter = 0;
								otm = 0;
							}
							else {
								counter++;
							}
							
                            var x = MarginL + c;
                            var y = MarginT + r;
                            //Darken uniformly
                            pixColor = bmp.GetPixel(x, y);
                            re = pixColor.R * pixColor.A / 255 + (255-pixColor.A);
                        	gr = pixColor.G * pixColor.A / 255 + (255-pixColor.A);
                            bl = pixColor.B * pixColor.A / 255 + (255-pixColor.A);
                            
                            imgC = Color.FromArgb((re/HashSize)*HashSize,(gr/HashSize)*HashSize,(bl/HashSize)*HashSize).GetHashCode();
							
							//Color hashColor = Color.FromArgb(re,gr,bl);
							//int imgC = hashColor.GetHashCode();
								
                            outval = 0;
                            if (tripMatrix[r, c] > 15 && darkhash.TryGetValue(imgC, out outval))
							{
								re = (outval & 0xFF0000) >> 16;
								gr = (outval & 0xFF00) >> 8;
								bl = outval & 0xFF;
								repdarkcell++;
							}
							else
							{
								if (TextType == "hsl"){
									RgbToHls(re,gr,bl,out h,out l,out s);
									
									if (tripMatrix[r, c] > 15){
										var res = textFunc.Call (tripMatrix[r, c],h,s,l);
										h = Convert.ToDouble(res[0]);
										s = Convert.ToDouble(res[1]);
										l = Convert.ToDouble(res[2]);
										HlsToRgb(h, l, s,out re, out gr, out bl);
									}
									else {
										var resD = textFunc.Call (tripMatrix[r, c],h,s,l);
										int reD; int grD; int blD;
										int reL; int grL; int blL;
										HlsToRgb(Convert.ToDouble(resD[0]), Convert.ToDouble(resD[2]), Convert.ToDouble(resD[1]),out reD, out grD, out blD);
										var resL = scriptFunc.Call (30,h,s,l);
										
										HlsToRgb(Convert.ToDouble(resL[0]), Convert.ToDouble(resL[2]), Convert.ToDouble(resL[1]),out reL, out grL, out blL);
										re = reD * tripMatrix[r,c] + reL * (16 - tripMatrix[r,c]);
										gr = grD * tripMatrix[r,c]+ grL * (16 - tripMatrix[r,c]);
										bl = blD * tripMatrix[r,c]+ blL * (16 - tripMatrix[r,c]);
										

										re /= 16;
										gr /= 16;
										bl /= 16;
									}
									
									
								
									if (tripMatrix[r, c] > 15){
										newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
										darkhash.Add(imgC, newcol);
									}
									
									
									
									
								}
								else {
									if (tripMatrix[r, c] > 15){
										var res = textFunc.Call (tripMatrix[r, c],re,gr,bl);
										re = Convert.ToInt32(res[0]);
										gr = Convert.ToInt32(res[1]);
										bl = Convert.ToInt32(res[2]);
										if (re > 255){re=255;}
										else if (re < 0){re=0;}
										if (gr > 255){gr=255;}
										else if (gr < 0){gr=0;}
										if (bl > 255){bl=255;}
										else if (bl < 0){bl=0;}
										newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
										darkhash.Add(imgC, newcol);
									}
									else {
										var resD = textFunc.Call (tripMatrix[r, c],re,gr,bl);
										var resL = scriptFunc.Call (30,re,gr,bl);
										re = Convert.ToInt32(resD[0]) * (tripMatrix[r,c]);
										gr = Convert.ToInt32(resD[1]) * (tripMatrix[r,c]);
										bl = Convert.ToInt32(resD[2]) * (tripMatrix[r,c]);
										re += Convert.ToInt32(resL[0]) * (16 - tripMatrix[r,c]);
										gr += Convert.ToInt32(resL[1]) * (16 - tripMatrix[r,c]);
										bl += Convert.ToInt32(resL[2]) * (16 - tripMatrix[r,c]);
										
										re /= 16;
										gr /= 16;
										bl /= 16;
										if (re > 255){re=255;}
										else if (re < 0){re=0;}
										if (gr > 255){gr=255;}
										else if (gr < 0){gr=0;}
										if (bl > 255){bl=255;}
										else if (bl < 0){bl=0;}
									}
								
								}
								newdarkcell++;
								
							}
							
							
							
							foreBrushCustom.Color = Color.FromArgb(re,gr,bl);
							graph.FillRectangle(foreBrushCustom, x, y, CellWidth, CellWidth);
							
									
							
                        }
                        else { //tripMatrix[r, c]<0 so Background
                        	if (counter >= 19){
								ore = -1;
								ogr = -1;
								obl = -1;
								oimgC = -1;
								counter = 0;
								otm = 0;
							}
                        	var x = MarginL + c;
                            var y = MarginT + r;
                            pixColor = bmp.GetPixel(x, y);
                        	re = pixColor.R * pixColor.A / 255 + (255-pixColor.A);
                            gr = pixColor.G * pixColor.A / 255 + (255-pixColor.A);
                            bl = pixColor.B * pixColor.A / 255 + (255-pixColor.A);
							Color hashColor = Color.FromArgb((re/HashSize)*HashSize,(gr/HashSize)*HashSize,(bl/HashSize)*HashSize);
							//int imgC = hashColor.GetHashCode();
							
							if (tripMatrix[r, c]<-101){
								tripMatrix[r, c]=-101;
							}
							tripMatrix[r, c] *= -1;
							
							h =0; s=0; l=0;
							imgC = 0;
							
							if (BlurType == "rgb"){
								if (varD) {
									imgC += tripMatrix[r, c];
									imgC *= 256;
								}
								if (varR){
									imgC += hashColor.R;
									imgC *= 256;
								}
								if (varG){
									imgC += hashColor.G;
									imgC *= 256;
								}
								if (varB){
									imgC += hashColor.B;
								}
							}
							else {
								
								RgbToHls(hashColor.R,hashColor.G,hashColor.B,out h,out l,out s);
								if (varH){
									if (varD) {
										imgC += tripMatrix[r, c];
										imgC *= 360;
									}
									imgC += Convert.ToInt32(h);
									imgC *= 200;
								}
								else {
									if (varD) {
										imgC += tripMatrix[r, c];
										imgC *= 200;
									}
								}
								if (varS){
									imgC += Convert.ToInt32(s*200);
									imgC *= 200;
								}
								if (varL){
									imgC += Convert.ToInt32(l*200);
								}
							}
							
							if (imgC == oimgC && otm == tripMatrix[r, c]){
								counter++;
								continue;
							}
							else {
								oimgC = imgC;
								
							}
							
                            outval = 0;
                            if (lighthash.TryGetValue(imgC, out outval))
							{
								re = (outval & 0xFF0000) >> 16;
								gr = (outval & 0xFF00) >> 8;
								bl = outval & 0xFF;
								
								
								repcell++;
							}
							else {
								
								
								//Lighten uniformly
								if (BlurType == "hsl"){
									
									var res = scriptFunc.Call (tripMatrix[r, c],h,s,l);
									h = Convert.ToDouble(res[0]);
									s = Convert.ToDouble(res[1]);
									l = Convert.ToDouble(res[2]);
							
									HlsToRgb(h, l, s,out re, out gr, out bl);
									
									newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
									lighthash[imgC] =newcol;
							
									
								}
								else {
									var res = scriptFunc.Call (tripMatrix[r, c],re,gr,bl);
									re = Convert.ToInt32(res[0]);
									gr = Convert.ToInt32(res[1]);
									bl = Convert.ToInt32(res[2]);
									if (re > 255){re=255;}
									else if (re < 0){re=0;}
									if (gr > 255){gr=255;}
									else if (gr < 0){gr=0;}
									if (bl > 255){bl=255;}
									else if (bl < 0){bl=0;}
									newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
									lighthash[imgC] =newcol;
							
									
								}
								newcell++;
							}
							
							if (re == ore && gr == ogr && bl == obl && otm == tripMatrix[r, c]){
								counter++;
								continue;
							}
							else {
								counter = 0;
								ore = re;
								ogr = gr;
								obl = bl;
								otm = tripMatrix[r, c];
							}
							int brushW = CellWidth*20;
							if (TWidth-c<brushW){brushW = TWidth-c;}
							if (bmp.Width-x<brushW){brushW = bmp.Width-x;}
							
							
							foreBrushCustom.Color = Color.FromArgb(re,gr,bl);
							graph.FillRectangle(foreBrushCustom, x, y, brushW,CellWidth);
							
							//graph.FillRectangle(foreBrushCustom, x, y, CellWidth,CellWidth);
							
							
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
				Console.WriteLine("GraphicsTextDrawerTime " + elapsedTime +" new/rep "+newcell+'/'+repcell +" newd/repd "+newdarkcell+'/'+repdarkcell);
            }
			
			if (Type == "text"){
				Bitmap nb = new Bitmap(TWidth, THeight);
				Graphics g = Graphics.FromImage(nb);
				g.DrawImage(bmpp, -MarginL, -MarginT);
				bmpp = nb;
			}
				
            return new BitmapFrame(bmpp);
        }     
        
        public static void RgbToHls(int r, int g, int b,
			out double h, out double l, out double s)
		{
			// Convert RGB to a 0.0 to 1.0 range.
			if (r>255){r=255;}
			else if (r<0){r=0;}
			if (g>255){g=255;}
			else if (g<0){g=0;}
			if (b>255){b=255;}
			else if (b<0){b=0;}
			double double_r = r / 255.0;
			double double_g = g / 255.0;
			double double_b = b / 255.0;

			// Get the maximum and minimum RGB components.
			double max = double_r;
			if (max < double_g) max = double_g;
			if (max < double_b) max = double_b;

			double min = double_r;
			if (min > double_g) min = double_g;
			if (min > double_b) min = double_b;

			double diff = max - min;
			l = (max + min) / 2;
			if (Math.Abs(diff) < 0.00001)
			{
				s = 0;
				h = 0;  // H is really undefined.
			}
			else
			{
				if (l <= 0.5) s = diff / (max + min);
				else s = diff / (2 - max - min);

				double r_dist = (max - double_r) / diff;
				double g_dist = (max - double_g) / diff;
				double b_dist = (max - double_b) / diff;

				if (double_r == max) h = b_dist - g_dist;
				else if (double_g == max) h = 2 + r_dist - b_dist;
				else h = 4 + g_dist - r_dist;

				h = h * 60;
				if (h < 0) h += 360;
			}
		}

		// Convert an HLS value into an RGB value.
		public static void HlsToRgb(double h, double l, double s,
			out int r, out int g, out int b)
		{
			h = h % 360;
			if (s>1){s=1;}
			else if (s<0){s=0;}
			if (l>1){l=1;}
			else if (l<0){l=0;}
			double p2;
			if (l <= 0.5) p2 = l * (1 + s);
			else p2 = l + s - l * s;

			double p1 = 2 * l - p2;
			double double_r, double_g, double_b;
			if (s == 0)
			{
				double_r = l;
				double_g = l;
				double_b = l;
			}
			else
			{
				double_r = QqhToRgb(p1, p2, h + 120);
				double_g = QqhToRgb(p1, p2, h);
				double_b = QqhToRgb(p1, p2, h - 120);
			}

			// Convert RGB to the 0 to 255 range.
			r = (int)(double_r * 255.0);
			g = (int)(double_g * 255.0);
			b = (int)(double_b * 255.0);
		}    
		private static double QqhToRgb(double q1, double q2, double hue)
		{
			if (hue > 360) hue -= 360;
			else if (hue < 0) hue += 360;

			if (hue < 60) return q1 + (q2 - q1) * hue / 60;
			if (hue < 180) return q2;
			if (hue < 240) return q1 + (q2 - q1) * (240 - hue) / 60;
			return q1;
		}
        
    }
    
}
