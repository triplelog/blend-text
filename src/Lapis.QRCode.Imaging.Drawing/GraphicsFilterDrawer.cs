using Lapis.QRCode.Encoding;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using NLua;

namespace Lapis.QRCode.Imaging.Drawing
{
    public class GraphicsFilterDrawer : TripMatrixDrawerBase
    {
        public override IImage Draw(TripMatrix tripMatrix)
        {
            if (tripMatrix == null)
                throw new ArgumentNullException(nameof(tripMatrix));
			
			Stopwatch stopWatch = new Stopwatch();
        	stopWatch.Start();
        	
        	
			

            int imageHeight = bmp.Height;
            int imageWidth = bmp.Width;
			
			Lua state = new Lua ();
			
            using (var graph = Graphics.FromImage(bmp))
            {
                //graph.Clear(Color.FromArgb(255,255,255));
                //var foreBrush = new SolidBrush(ColorHelper.FromIntRgb24(Foreground));
                var foreBrush = new SolidBrush(Color.FromArgb(40,40,40));
                var foreBrushB = new SolidBrush(Color.FromArgb(0,0,0,0));
                
        		var foreBrushCustom = new SolidBrush(Color.FromArgb(0,0,120));
        		
				Dictionary<int, int> lighthash = new Dictionary<int, int>();
				Dictionary<int, int> darkhash = new Dictionary<int, int>();
				
				var nFilters = BlurType.Length;
        		state.DoString (TextFormula);
        		LuaFunction[] filters = new LuaFunction[nFilters];
        		int[] filterTypes = new int[nFilters];
        		for (var i=0;i<nFilters;i++){
					if (BlurType[i] == 'h'){filterTypes[i]=0;}
					if (BlurType[i] == 'r'){filterTypes[i]=1;}
					int myInt = i+1;
					string iStr = myInt.ToString();
					filters[i] = state ["Filter"+iStr] as LuaFunction;
				}
				int newcell =0;
				int repcell = 0;
				int newdarkcell =0;
				int repdarkcell = 0;
				Color pixColor;
				int imgC;
				int re; int gr; int bl;
				int outval; int newcol;
				double h; double s; double l;
                for (var r = 0; r < THeight; r += CellWidth)
                {
                    for (var c = 0; c < TWidth; c += CellWidth)
                    {
                        
						//Darken uniformly
						pixColor = bmp.GetPixel(c, r);
						
						re = pixColor.R * pixColor.A / 255 + (255-pixColor.A);
						gr = pixColor.G * pixColor.A / 255 + (255-pixColor.A);
						bl = pixColor.B * pixColor.A / 255 + (255-pixColor.A);
						
						imgC = Color.FromArgb((re/HashSize)*HashSize,(gr/HashSize)*HashSize,(bl/HashSize)*HashSize).GetHashCode();

							
						outval = 0;
						if (darkhash.TryGetValue(imgC, out outval))
						{
							re = (outval & 0xFF0000) >> 16;
							gr = (outval & 0xFF00) >> 8;
							bl = outval & 0xFF;
							repdarkcell++;
						}
						else
						{
							for (var filterIdx=0;filterIdx<nFilters;filterIdx++){
								if (filterTypes[filterIdx] == 0){
									
									RgbToHls(re,gr,bl,out h,out l,out s);
								
									var res = filters[filterIdx].Call (h,s,l);
									h = Convert.ToDouble(res[0]);
									s = Convert.ToDouble(res[1]);
									l = Convert.ToDouble(res[2]);
									HlsToRgb(h, l, s,out re, out gr, out bl);
								
								
								}
								else {
									var res = filters[filterIdx].Call (re,gr,bl);
									re = Convert.ToInt32(res[0]);
									gr = Convert.ToInt32(res[1]);
									bl = Convert.ToInt32(res[2]);
								}
							}
							
							if (re > 255 || gr > 255 || bl > 255){
								//Console.WriteLine(" red: "+re+" gr: "+gr+" bl: "+bl+" a: "+pixColor.A);
								//Console.WriteLine(" redC: "+pixColor.R+" grC: "+pixColor.G+" blC: "+pixColor.B);
								if (re > 255){re = 255;}
								if (gr > 255){gr = 255;}
								if (bl > 255){bl = 255;}
							}
							else if (re < 0 || gr < 0 || bl < 0){
								//Console.WriteLine(" red0: "+re+" gr: "+gr+" bl: "+bl+" a: "+pixColor.A);
								//Console.WriteLine(" redC: "+pixColor.R+" grC: "+pixColor.G+" blC: "+pixColor.B);
								if (re < 0){re = 0;}
								if (gr < 0){gr = 0;}
								if (bl < 0){bl = 0;}
							}
							newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
							darkhash.Add(imgC, newcol);
						
							
							
							newdarkcell++;
							
						}
						
						
						foreBrushCustom.Color = Color.FromArgb(re,gr,bl);
						graph.FillRectangle(foreBrushCustom, c, r, CellWidth,CellWidth);
							
									
							
                        
                        
                    }
                }
                
                

                stopWatch.Stop();
				// Get the elapsed time as a TimeSpan value.
				TimeSpan ts = stopWatch.Elapsed;
				
				

				// Format and display the TimeSpan value.
				string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
					ts.Hours, ts.Minutes, ts.Seconds,
					ts.Milliseconds / 10);
				Console.WriteLine("GraphicsFilterDrawerTime " + elapsedTime +" newd/repd "+newdarkcell+'/'+repdarkcell);
            }
			
				
            return new BitmapFrame(bmp);
        }     
        
        public static void RgbToHls(int r, int g, int b,
			out double h, out double l, out double s)
		{
			// Convert RGB to a 0.0 to 1.0 range.
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
