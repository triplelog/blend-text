using Lapis.QRCode.Encoding;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Lapis.QRCode.Imaging.Drawing
{
    public class GraphicsDrawer : BitMatrixDrawerBase
    {
        public override IImage Draw(BitMatrix bitMatrix, ColorMatrix colorMatrix)
        {
            if (bitMatrix == null)
                throw new ArgumentNullException(nameof(bitMatrix));
			
            int rowCount = bitMatrix.RowCount;
            int columnCount = bitMatrix.ColumnCount;
            int imageHeight = CellSize * rowCount + Margin * 2;
            int imageWidth = CellSize * rowCount + Margin * 2;
            var bitmap = new Bitmap(imageHeight, imageWidth);
			Console.WriteLine(CellSize);
			Console.WriteLine(rowCount);
			Console.WriteLine(imageHeight);
            using (var graph = Graphics.FromImage(bitmap))
            {
                graph.Clear(ColorHelper.FromIntRgb24(Background));
                //var foreBrush = new SolidBrush(ColorHelper.FromIntRgb24(Foreground));
                var foreBrush = new SolidBrush(Color.FromArgb(40,40,40));
                var foreBrushB = new SolidBrush(Color.FromArgb(0,0,120));
                for (var r = 0; r < rowCount; r += 1)
                {
                    for (var c = 0; c < columnCount; c += 1)
                    {
                        if (bitMatrix[r, c])
                        {
                            var x = Margin + c * CellSize;
                            var y = Margin + r * CellSize;
                            for (var cmi = 0;cmi<CellSize;cmi++){
                            	for (var cmj = 0;cmj<CellSize;cmj++){
									int re = (colorMatrix[CellSize*r+cmi,CellSize*c+cmj] & 0xFF0000) >> 16;
									int gr = (colorMatrix[CellSize*r+cmi,CellSize*c+cmj] & 0xFF00) >> 8;
									int bl = colorMatrix[CellSize*r+cmi,CellSize*c+cmj] & 0xFF;
							
									//Darken uniformly
									
										double h; double s; double l;
										RgbToHls(re,gr,bl,out h,out l,out s);
										l = l/(3*Math.Log(l+1.5)/Math.Log(2));
										//s = 1 - (1-s)/1.25;
										HlsToRgb(h, l, s,out re, out gr, out bl);
										
									Color myColor = Color.FromArgb(re,gr,bl);
									var foreBrushCustom = new SolidBrush(myColor);
									graph.FillRectangle(foreBrushCustom, x+cmj, y+cmi, 1,1);
								}
							}
                        }
                        else {
                        	var x = Margin + c * CellSize;
                            var y = Margin + r * CellSize;
                            for (var cmi = 0;cmi<CellSize;cmi++){
                            	for (var cmj = 0;cmj<CellSize;cmj++){
									int re = (colorMatrix[CellSize*r+cmi,CellSize*c+cmj] & 0xFF0000) >> 16;
									int gr = (colorMatrix[CellSize*r+cmi,CellSize*c+cmj] & 0xFF00) >> 8;
									int bl = colorMatrix[CellSize*r+cmi,CellSize*c+cmj] & 0xFF;
							
									//Lighten uniformly
									
										double h; double s; double l;
										RgbToHls(re,gr,bl,out h,out l,out s);
										//l = 1 - (1-l)/6;
										l = 1 - (1-l)/(3*Math.Log((1-l)+1.5)/Math.Log(2));
										HlsToRgb(h, l, s,out re, out gr, out bl);
							
									var foreBrushCustom = new SolidBrush(Color.FromArgb(re,gr,bl));
									graph.FillRectangle(foreBrushCustom, x+cmj, y+cmi, 1,1);
								}
							}
                        }
                    }
                }
            }

            return new BitmapFrame(bitmap);
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
