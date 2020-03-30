using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using Microsoft.Extensions.CommandLineUtils;
using Lapis.QRCode.Encoding;
using Lapis.QRCode.Art;
using Lapis.QRCode.Imaging;
using Lapis.QRCode.Imaging.Drawing;
using System.Collections.Generic;
using System.Linq;

namespace Lapis.QrArt
{
    partial class Program
    {
        private static bool CheckContent(string content, string imagePath, out IRgb24BitmapBase bitmapText)
        {
            if (content == null)
            {
                LogError("Content required.");
                return false;
            }
            try
            {
            	var bmp = Bitmap.FromFile(imagePath) as Bitmap;
            	Graphics graph1 = Graphics.FromImage(bmp);
            	string measureString = content;
				Font stringFont = new Font("Tahoma",80);
				SizeF stringSize = new SizeF();
				stringSize = graph1.MeasureString(measureString, stringFont);
            	Console.WriteLine("width "+stringSize.Width + " height "+ stringSize.Height);
            	int twidth = (int)stringSize.Width;
            	int theight = (int)stringSize.Height;
            	
            	Bitmap bmpp = (Bitmap) new Bitmap(twidth,theight);
				using (Graphics graph = Graphics.FromImage(bmpp))
				{
					Rectangle ImageSize = new Rectangle(0,0,twidth+20,theight+20);
					graph.FillRectangle(Brushes.White, ImageSize);
					graph.SmoothingMode = SmoothingMode.AntiAlias;
					graph.InterpolationMode = InterpolationMode.HighQualityBicubic;
					graph.PixelOffsetMode = PixelOffsetMode.HighQuality;
					graph.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
					StringFormat format = new StringFormat()
					{
						Alignment = StringAlignment.Center,
						LineAlignment = StringAlignment.Center
					};
					RectangleF rectf = new RectangleF(10, 10, twidth,theight);
					graph.DrawString("Text", new Font("Tahoma",80), Brushes.Black, rectf, format);
				}
				bitmapText = new BitmapFrame(bmpp);
                return true;
            }
            catch (Exception ex)
            {
                LogError(ex.Message);
                bitmapText = null;
                return false;
            }
            return true;
        }

        private static bool CheckImagePath(string imagePath, out IRgb24BitmapBase bitmap)
        {
            if (imagePath == null)
            {
                bitmap = null;
                return true;
            }
            if (!File.Exists(imagePath))
            {
                LogError("File not found.");
                bitmap = null;
                return false;
            }
            try
            {
            	var bmp = Bitmap.FromFile(imagePath) as Bitmap;
                
                bitmap = new BitmapFrame(bmp);
                return true;
            }
            catch (Exception ex)
            {
                LogError(ex.Message);
                bitmap = null;
                return false;
            }
        }

        private static bool CheckFormat(string format, out ITripMatrixDrawer textDrawer)
        {
        	textDrawer = new GraphicsTextDrawer();
            if (format == null)
            {
                LogError("Format required.");
                //drawer = null;
                return false;
            }
            if (format.Equals("svg", StringComparison.OrdinalIgnoreCase))
            {
                //drawer = new SvgDrawer();
                return true;
            }
            if (format.Equals("gif", StringComparison.OrdinalIgnoreCase))
            {
                //drawer = new Rgb24BitmapDrawer();
                return true;
            }
            if (format.Equals("png", StringComparison.OrdinalIgnoreCase))
            {
                //drawer = new GraphicsDrawer();
                return true;
            }
            if (format.Equals("txt", StringComparison.OrdinalIgnoreCase))
            {
                textDrawer = new GraphicsTextDrawer();
                //drawer = new GraphicsDrawer();
                return true;
            }
            LogError("Format not supported.");
            textDrawer = null;
            return false;
        }

        private static bool CheckFontSize(string s, out int fontSize)
        {
            if (string.IsNullOrWhiteSpace(type))
            {
                fontSize = 40;
                return true;
            }
            if (int.TryParse(s, out fontSize) && fontSize > 0)
                return true;
            LogError("Invalid type number.");
            return false;
        }

        private static bool CheckErrorCorrectLevel(string errcor, out ErrorCorrectLevel errorCorrectLevel)
        {
            if (string.IsNullOrWhiteSpace(errcor))
            {
                errorCorrectLevel = ErrorCorrectLevel.M;
                return true;
            }
            if (Enum.TryParse<ErrorCorrectLevel>(errcor, out errorCorrectLevel))
                return true;
            LogError("Invalid error correct level.");
            return false;
        }

        private static bool CheckForeground(string foregd, out int color)
        {
            if (string.IsNullOrWhiteSpace(foregd))
            {
                color = 0x000000;
                return true;
            }
            if (int.TryParse(foregd.TrimStart('#'), System.Globalization.NumberStyles.HexNumber, null, out color))
                return true;
            LogError("Invalid foreground color.");
            return false;
        }

        private static bool CheckBackground(string backgd, out int color)
        {
            if (string.IsNullOrWhiteSpace(backgd))
            {
                color = 0xFFFFFF;
                return true;
            }
            if (int.TryParse(backgd.TrimStart('#'), System.Globalization.NumberStyles.HexNumber, null, out color))
                return true;
            LogError("Invalid background color.");
            return false;
        }

        private static bool CheckCell(string cell, out int cellSize)
        {
            if (string.IsNullOrWhiteSpace(cell))
            {
                cellSize = 3;
                return true;
            }
            if (int.TryParse(cell, out cellSize) &&
                cellSize > 0 && cellSize < 50)
                return true;
            LogError("Invalid cell size.");
            return false;
        }

        private static bool CheckMargin(string margin, out int marginValue)
        {
            if (string.IsNullOrWhiteSpace(margin))
            {
                marginValue = 8;
                return true;
            }
            if (int.TryParse(margin, out marginValue) &&
                marginValue > 0 && marginValue < 50)
                return true;
            LogError("Invalid margin.");
            return false;
        }

        private static void Write(IImage image, string path)
        {
            using (var stream = new System.IO.FileStream(path, System.IO.FileMode.OpenOrCreate))
            {
                image.Save(stream);
            }
        }
    }
}