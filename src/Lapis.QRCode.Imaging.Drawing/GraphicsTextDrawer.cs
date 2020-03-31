using Lapis.QRCode.Encoding;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLua;

namespace Lapis.QRCode.Imaging.Drawing
{
    public class GraphicsTextDrawer : TripMatrixDrawerBase
    {
        public override IImage Draw(TripMatrix tripMatrix, ColorMatrix colorMatrix, string imagePath)
        {
            if (tripMatrix == null)
                throw new ArgumentNullException(nameof(tripMatrix));
			
			Stopwatch stopWatch = new Stopwatch();
        	stopWatch.Start();
        		
            int rowCount = colorMatrix.RowCount;
            int columnCount = colorMatrix.ColumnCount;
            int imageHeight = rowCount;
            int imageWidth = columnCount;
            int theight = tripMatrix.RowCount;
            int twidth = tripMatrix.ColumnCount;
            //var bitmap = new Bitmap(imageHeight, imageWidth);
            var bmp = Bitmap.FromFile(imagePath) as Bitmap;
			Console.WriteLine(CellSize);
			Console.WriteLine(rowCount);
			Console.WriteLine(imageHeight);
			
			Lua state = new Lua ();
			
            using (var graph = Graphics.FromImage(bmp))
            {
                //graph.Clear(ColorHelper.FromIntRgb24(Background));
                //var foreBrush = new SolidBrush(ColorHelper.FromIntRgb24(Foreground));
                var foreBrush = new SolidBrush(Color.FromArgb(40,40,40));
                var foreBrushB = new SolidBrush(Color.FromArgb(0,0,120));
                
        		var foreBrushCustom = new SolidBrush(Color.FromArgb(0,0,120));
        		int startR = 0;
        		int startC = 0;
        		if (MarginT < 0){
        			startR = 0 - MarginT;
        		}
        		if (MarginL < 0){
        			startC = 0 - MarginL;
        		}
        		Console.WriteLine(BlurFormula);
        		/*
        		string luaString = @"
				function ScriptFunc (val,l,s)
					if val < -25 then
						if l < .6 then
							l = .6
						end
						if s > .4 then
							s = .4
						end
					else 
						if l < .5 then
							l = .5
						end
						if s > .4 then
							s = .4
						end
					end
					return l,s
				end
				";*/
				
				Dictionary<int, int> lighthash = new Dictionary<int, int>();
				Dictionary<int, int> darkhash = new Dictionary<int, int>();
				
        		state.DoString (BlurFormula);
				var scriptFunc = state ["ScriptFunc"] as LuaFunction;
				int newcell =0;
				int repcell = 0;
				int newdarkcell =0;
				int repdarkcell = 0;
	
                for (var r = startR; r < theight && r + MarginT < bmp.Height; r += 1)
                {
                    for (var c = startC; c < twidth && c + MarginL < bmp.Width; c += 1)
                    {
                        if (tripMatrix[r, c] == 0)
                        {
                        	//keep color as is
                        }
                        else if (tripMatrix[r, c] > 0)
                        {
                            var x = MarginL + c;
                            var y = MarginT + r;
                            //Darken uniformly
                            Color pixColor = bmp.GetPixel(x, y);
                            int re = pixColor.R;
                            int gr = pixColor.G;
                            int bl = pixColor.B;
							Color hashColor = Color.FromArgb(re,gr,bl);
							int imgC = hashColor.GetHashCode();
								
                            int outval = 0;
                            if (tripMatrix[r, c] > 2 && darkhash.TryGetValue(imgC, out outval))
							{
								re = (outval & 0xFF0000) >> 16;
								gr = (outval & 0xFF00) >> 8;
								bl = outval & 0xFF;
								foreBrushCustom = new SolidBrush(Color.FromArgb(re,gr,bl));
								graph.FillRectangle(foreBrushCustom, x, y, 1,1);
								repdarkcell++;
							}
							else
							{
								double h; double s; double l;
								RgbToHls(re,gr,bl,out h,out l,out s);
								//l = (l*1)/(tripMatrix[r, c]*Math.Log(l+1.5)/Math.Log(2));
								//s = 1 - (1-s)/1.25;
								if (tripMatrix[r, c] ==1){
									//l = ( (1 - (1-l)/2)*2 + (l/3) )/3;
									if (l > .7){
										l = .6;
									}
									else {
										l = (l*2 + .3*1)/3;
									}
									s = s*1/2;
								}
								else if (tripMatrix[r, c] == 2){
									//l = ( (1 - (1-l)/2) + (l/3)*2 )/3;
									if (l > .7){
										l = .45;
									}
									else {
										l = (l + .3*2)/3;
									}
								
									s = s*2/3;
								}
								else{
									//l = l/3;
									if (l > .2){
										l = .2;
									}
								}
								//s = 1 - (1-s)/2;
								HlsToRgb(h, l, s,out re, out gr, out bl);
								
								if (tripMatrix[r, c] > 2){
									int newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
									darkhash.Add(imgC, newcol);
								}
								
								foreBrushCustom = new SolidBrush(Color.FromArgb(re,gr,bl));
								graph.FillRectangle(foreBrushCustom, x, y, 1,1);
								newdarkcell++;
							}
							
									
							
                        }
                        else {
                        	var x = MarginL + c;
                            var y = MarginT + r;
							
                            Color pixColor = bmp.GetPixel(x, y);
                            int re = pixColor.R;
                            int gr = pixColor.G;
                            int bl = pixColor.B;
							Color hashColor = Color.FromArgb((re/4)*4,(gr/4)*4,(bl/4)*4);
							int imgC = hashColor.GetHashCode();
								
                            int outval = 0;
                            if (lighthash.TryGetValue(imgC, out outval))
							{
								re = (outval & 0xFF0000) >> 16;
								gr = (outval & 0xFF00) >> 8;
								bl = outval & 0xFF;
								foreBrushCustom = new SolidBrush(Color.FromArgb(re,gr,bl));
								graph.FillRectangle(foreBrushCustom, x, y, 1,1);
								repcell++;
							}
							else {
								
								
								//Lighten uniformly
							
								double h; double s; double l;
								RgbToHls(re,gr,bl,out h,out l,out s);
								var res = scriptFunc.Call (tripMatrix[r, c],h,s,l);
								l = (double)res[2];
								s = (double)res[1];
							
								HlsToRgb(h, l, s,out re, out gr, out bl);
								
								int newcol = ColorHelper.ToIntRgb24(Color.FromArgb(re,gr,bl));
								lighthash.Add(imgC, newcol);
							
								foreBrushCustom = new SolidBrush(Color.FromArgb(re,gr,bl));
								graph.FillRectangle(foreBrushCustom, x, y, 1,1);
								newcell++;
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
				Console.WriteLine("GraphicsTextDrawerTime " + elapsedTime +" new/rep "+newcell+'/'+repcell +" newd/repd "+newdarkcell+'/'+repdarkcell);
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
