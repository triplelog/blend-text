using Lapis.QRCode.Encoding;
using Lapis.QRCode.Imaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lapis.QRCode.Art
{
    public interface IBinarizer
    {
        BitMatrix Binarize(IRgb24BitmapBase bitmap, int rowCount, int columnCount, double threshold);
    }

    public class Binarizer : IBinarizer
    {
        public BitMatrix Binarize(IRgb24BitmapBase bitmap, int rowCount, int columnCount, double threshold)
        {
            if (bitmap == null)
                throw new ArgumentNullException(nameof(bitmap));
            var bitMatrix = new BitMatrix(rowCount, columnCount);
			
            int[,] rgb24s = Sample(bitmap, rowCount, columnCount);
            /*int[,] grays = ToGrays(rgb24s);
            int[] histGram = GetHistGram(grays);
            //int threshold = GetThreshold(histGram);
            Console.WriteLine("Threshold:" + threshold);
            for (int i = 0; i < grays.GetLength(0); i++)
            {
                for (int j = 0; j < grays.GetLength(1); j++)
                {
                    bitMatrix[i, j] = grays[i, j] < threshold;
                }
            }
            */
            for (int i = 0; i < rgb24s.GetLength(0); i++)
            {
                for (int j = 0; j < rgb24s.GetLength(1); j++)
                {
                	int r = (rgb24s[i, j] & 0xFF0000) >> 16;
                    int g = (rgb24s[i, j] & 0xFF00) >> 8;
                    int b = rgb24s[i, j] & 0xFF;
                    RgbToHls(r, g, b, out double h, out double l, out double s);
                    bitMatrix[i, j] = l < threshold;
                }
            }
            return bitMatrix;
        }    

        private int[,] Sample(IRgb24BitmapBase bitmap, int rowCount, int columnCount)
        {
            float height = Convert.ToSingle(bitmap.Height);
            float width = Convert.ToSingle(bitmap.Width);
            float rowLength = Convert.ToSingle(rowCount);
            float columnLength = Convert.ToSingle(columnCount);
            int[,] rgb24s = new int[rowCount, columnCount];
            for (int i = 0; i < columnCount; i++)
            {
                for (int j = 0; j < rowCount; j++)
                {
                    int x = Convert.ToInt32(width / columnLength * i);
                    int y = Convert.ToInt32(height / rowLength * j);
                    int color = bitmap.GetPixel(x, y);
                    rgb24s[j, i] = color;
                }
            }
            return rgb24s;
        }

        private int[,] ToGrays(int[,] rgb24s)
        {
            int[,] grays = new int[rgb24s.GetLength(0), rgb24s.GetLength(1)];
            for (int i = 0; i < rgb24s.GetLength(0); i++)
            {
                for (int j = 0; j < rgb24s.GetLength(1); j++)
                {
                    int r = (rgb24s[i, j] & 0xFF0000) >> 16;
                    int g = (rgb24s[i, j] & 0xFF00) >> 8;
                    int b = rgb24s[i, j] & 0xFF;
                    int grayscale = Convert.ToInt32(0.2126 * r + 0.7152 * g + 0.722 * b);
                    grays[i, j] = grayscale;
                }
            }
            return grays;
        }

        private int[] GetHistGram(int[,] grays)
        {
            int[] histGram = new int[256];
            for (int i = 0; i < grays.GetLength(0); i++)
            {
                for (int j = 0; j < grays.GetLength(1); j++)
                {
                    histGram[grays[i, j] & 0xFF] += 1;
                }
            }
            return histGram;
        }

        private int GetThreshold(int[] histGram)
        {
            int y, amount = 0;
            int pixelBack = 0, pixelFore = 0, pixelIntegralBack = 0, pixelIntegralFore = 0, pixelIntegral = 0;
            double omegaBack, omegaFore, microBack, microFore, sigmaB, sigma;
            int minValue, maxValue;
            int threshold = 0;

            for (minValue = 0; minValue < 256 && histGram[minValue] == 0; minValue++) ;
            for (maxValue = 255; maxValue > minValue && histGram[minValue] == 0; maxValue--) ;
            if (maxValue == minValue)
                return maxValue;
            if (minValue + 1 == maxValue)
                return minValue;

            for (y = minValue; y <= maxValue; y++)
                amount += histGram[y];

            pixelIntegral = 0;
            for (y = minValue; y <= maxValue; y++)
                pixelIntegral += histGram[y] * y;
            sigmaB = -1;
            for (y = minValue; y < maxValue; y++)
            {
                pixelBack = pixelBack + histGram[y];
                pixelFore = amount - pixelBack;
                omegaBack = (double)pixelBack / amount;
                omegaFore = (double)pixelFore / amount;
                pixelIntegralBack += histGram[y] * y;
                pixelIntegralFore = pixelIntegral - pixelIntegralBack;
                microBack = (double)pixelIntegralBack / pixelBack;
                microFore = (double)pixelIntegralFore / pixelFore;
                sigma = omegaBack * omegaFore * (microBack - microFore) * (microBack - microFore);
                if (sigma > sigmaB)
                {
                    sigmaB = sigma;
                    threshold = y;
                }
            }
            return threshold;
        }
        
        private static void RgbToHls(int r, int g, int b,
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
    }
}