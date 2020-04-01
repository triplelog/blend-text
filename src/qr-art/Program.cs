using System;
using System.Diagnostics;
using System.IO;
using System.Drawing;
using Microsoft.Extensions.CommandLineUtils;
using Lapis.QRCode.Encoding;
using Lapis.QRCode.Imaging;
using Lapis.QRCode.Imaging.Drawing;
using Lapis.QRCode.Art;
using System.Collections.Generic;
using System.Linq;
using System.Drawing.Drawing2D;
using System.Drawing.Text;

namespace Lapis.QrArt
{
    partial class Program
    {
        static void Main(string[] args)
        {
            var app = new CommandLineApplication(false);
            app.Name = "qr-art";
            app.Description = "An artistic QR code generator.";
            app.HelpOption("-?|-h|--help");
            app.VersionOption("-v|--version", "qr-art 1.0");

            var contentArg = app.Argument("content", "Text to overlay.");
            var imageArg = app.Argument("image", "An image to be used as background.");
            var formatArg = app.Argument("format", "Output image format. [png|gif|svg]");
            var pathArg = app.Argument("outpath", "Output path.");
            var fontSizeOpt = app.Option("-s|--size <number>", "Font Size", CommandOptionType.SingleValue);
            var locXOpt = app.Option("-x <number>", "location X", CommandOptionType.SingleValue);
            var locYOpt = app.Option("-y <number>", "location Y", CommandOptionType.SingleValue);
            var blurRadiusOpt = app.Option("-r <number>", "Blur Radius", CommandOptionType.SingleValue);
            var blurFormulaOpt = app.Option("-b <number>", "Blur Formula", CommandOptionType.SingleValue);
            var textFormulaOpt = app.Option("-c <number>", "Text Formula", CommandOptionType.SingleValue);
            var fontOpt = app.Option("-f <string>", "Font", CommandOptionType.SingleValue);
            var typeOpt = app.Option("-t <string>", "Type", CommandOptionType.SingleValue);
            //legacy below
            //var foregdOpt = app.Option("-f|--foreground <color>", "Foreground color.", CommandOptionType.SingleValue);
            //var backgdOpt = app.Option("-b|--background <color>", "Background color.", CommandOptionType.SingleValue);
            var animationOpt = app.Option("-a|--animation", "Generate animated QR code.", CommandOptionType.NoValue);

            app.OnExecute(() =>
            {
                if (!animationOpt.HasValue())
                {                    
                    if (CheckContent(contentArg.Value) &&
                        CheckImagePath(imageArg.Value) &&
                        CheckFormat(formatArg.Value, out var textDrawer) &&
                        CheckFontSize(fontSizeOpt.Value(), out var fontSize) &&
                        CheckParams(locXOpt.Value(), locYOpt.Value(), blurRadiusOpt.Value(), blurFormulaOpt.Value(), textFormulaOpt.Value(), fontOpt.Value())
                        //add actual checks for above values
                        //CheckForeground(foregdOpt.Value(), out var foregd) &&
                        //CheckBackground(backgdOpt.Value(), out var backgd) &&
                        )
                    {
                    	
        				
                        var builder = new QRArtCreator(
                            new Triparizer(),
                            textDrawer
                        );
                        {
                            //textDrawer.Foreground = foregd;
                            //textDrawer.Background = backgd;
                            textDrawer.MarginL = 0;
                            textDrawer.MarginT = 0;
                            textDrawer.Type = typeOpt.Value();
                            //textDrawer.BlurFormula = blurFormulaOpt.Value();
                            textDrawer.BlurFormula = System.IO.File.ReadAllText(@"/home/rwilcox/blend-text/server/formulas/test.txt");

                        }
						
						int blurRadius = 5;
        				if (int.TryParse(blurRadiusOpt.Value(), out blurRadius)){}
						
						string fontVal = getFont(fontOpt.Value().ToLower());
						Font font = new Font(fontVal, fontSize);
        				Console.WriteLine(font.FontFamily);
        				
        				
        				Stopwatch stopWatch = new Stopwatch();
        				stopWatch.Start();
        				
        				Console.WriteLine("Start Program ");
        				Bitmap bmp = null;
        				IRgb24BitmapBase bitmapText = null;
        				IRgb24BitmapBase bitmap = null;
        				try
						{
							bmp = Bitmap.FromFile(imageArg.Value) as Bitmap;
							
							
							Graphics graph1 = Graphics.FromImage(bmp);
							string measureString = contentArg.Value;
							
							SizeF stringSize = new SizeF();
							stringSize = graph1.MeasureString(measureString, font);
							Console.WriteLine("width "+stringSize.Width + " height "+ stringSize.Height + "fSize "+fontSize);
							int twidth = (int)stringSize.Width;
							int theight = (int)stringSize.Height;
							
							Bitmap bmpp = (Bitmap) new Bitmap(twidth+2*blurRadius,theight+2*blurRadius);
							
						
							{
								int xPct = 0;
								int xType = 0;
								if (int.TryParse(locXOpt.Value(), out int locXout)){
									xPct = (locXout+200)%200;
									xType = locXout/200;
									if (xPct > 149){
										xPct -= 200;
										xType += 1;
									}
							
								}
								int yPct = 0;
								int yType = 0;
								if (int.TryParse(locYOpt.Value(), out int locYout)){
									yPct = (locYout+200)%200;
									yType = locYout/200;
									if (yPct > 149){
										yPct -= 200;
										yType += 1;
									}
								}
								if (xType == 0){
									//middle at (bmp.Width * xPct)/100
									textDrawer.MarginL = (bmp.Width * xPct)/100 - (twidth+2*blurRadius)/2;
								}
								else if (xType == 1){
									//left at (bmp.Width * xPct)/100
									textDrawer.MarginL = (bmp.Width * xPct)/100 - blurRadius;
								}
								else if (xType == 2){
									//right at (bmp.Width * xPct)/100
									textDrawer.MarginL = (bmp.Width * xPct)/100 - (twidth+2*blurRadius) + blurRadius;
								}
								else {
									textDrawer.MarginL = bmp.Width/2 - (twidth+2*blurRadius)/2;
								}
							
								if (yType == 0){
									//middle at (bmp.Height * yPct)/100
									textDrawer.MarginT = (bmp.Height * yPct)/100 - (theight+2*blurRadius)/2;
								}
								else if (yType == 1){
									//top at 
									textDrawer.MarginT = (bmp.Height * yPct)/100 - blurRadius;
								}
								else if (yType == 2){
									//bottom at 
									textDrawer.MarginT = (bmp.Height * yPct)/100 - (theight+2*blurRadius) + blurRadius;
								}
								else {
									textDrawer.MarginT = bmp.Height/2 - (theight+2*blurRadius)/2;
								}
							} //set margins
							
							using (Graphics graph = Graphics.FromImage(bmpp))
							{
								Rectangle ImageSize = new Rectangle(0,0,twidth+2*blurRadius,theight+2*blurRadius);
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
								RectangleF rectf = new RectangleF(blurRadius, blurRadius, twidth,theight);
								graph.DrawString(contentArg.Value, font, Brushes.Black, rectf, format);
							}
							bitmapText = new BitmapFrame(bmpp);
							bitmap = new BitmapFrame(bmp);
						}
						catch (Exception ex)
						{
							LogError(ex.Message);
							bitmapText = null;
						}
        				
        				
        				
                        var image = builder.Create(contentArg.Value, bitmap, bitmapText, imageArg.Value, blurRadius);
                        //bitmap.Save("static/newbmp1.jpg", System.Drawing.Imaging.ImageFormat.Jpeg);
                        
                         stopWatch.Stop();
						// Get the elapsed time as a TimeSpan value.
						TimeSpan ts = stopWatch.Elapsed;

						// Format and display the TimeSpan value.
						string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
							ts.Hours, ts.Minutes, ts.Seconds,
							ts.Milliseconds / 10);
						Console.WriteLine("FullTime " + elapsedTime);
						
                        Write(image, pathArg.Value ??
                            (imageArg.Value == null ? "output." + formatArg.Value :
                            Path.Combine(Path.GetDirectoryName(imageArg.Value), 
                            Path.GetFileNameWithoutExtension(imageArg.Value) + "_output." + formatArg.Value)));
                        (bitmap as IDisposable)?.Dispose();
                        (image as IDisposable)?.Dispose();
                    }
                    else
                        app.ShowHelp();
                }
                else
                {
                    if (CheckContent(contentArg.Value) &&
                        CheckImagePathAnimation(imageArg.Value, out var animation, out var animationText) &&
                        CheckFormatAnimation(formatArg.Value, out var textDrawer) &&
                        CheckFontSize(fontSizeOpt.Value(), out var fontSize) &&
                        CheckParams(locXOpt.Value(), locYOpt.Value(), blurRadiusOpt.Value(), blurFormulaOpt.Value(), textFormulaOpt.Value(), fontOpt.Value())
                        //CheckForeground(foregdOpt.Value(), out var foregd) &&
                        //CheckBackground(backgdOpt.Value(), out var backgd) &&
                        )
                    {               
                        var builder = new QRAnimationCreator(
                            new Binarizer(),
                            new Triparizer(),
                            new Colorizer(),
                            new Merger(),
                            textDrawer,
                            // frames => new BitmapImage(frames.Select(f => f as BitmapFrame))
                            frames => new Rgb24Bitmap(frames.Select(f => f as Rgb24BitmapFrame))
                        );
                        {
                            //textDrawer.Foreground = foregd;
                            //textDrawer.Background = backgd;
                        }
						
        				
                        var image = builder.Create(contentArg.Value, animation, animationText, imageArg.Value, 5);
                        
                       
                                                
                        Write(image, pathArg.Value ??
                            (imageArg.Value == null ? "output." + formatArg.Value :
                            Path.Combine(Path.GetDirectoryName(imageArg.Value), 
                            Path.GetFileNameWithoutExtension(imageArg.Value) + "_output." + formatArg.Value)));
                        (animation as IDisposable)?.Dispose();
                        (image as IDisposable)?.Dispose();
                    }
                    else
                        app.ShowHelp();
                }
                return 0;
            });

            app.Execute(args);
        }

        private static void LogError(string message)
        {
            var color = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Error.WriteLine(message);
            Console.ForegroundColor = color;
        }
        private static string getFont(string input_str)
        {
        	string outFont = input_str;
        	int minLev = 100;
        	int myLev = 100;
        	FontFamily[] ffArray = FontFamily.Families;
			foreach (FontFamily ff in ffArray)
			{
				myLev = LevenshteinDistance(input_str, ff.Name.ToLower());
				if (myLev < minLev){
					minLev = myLev;
					outFont = ff.Name;
				}
			}
			Console.WriteLine("original" + input_str + " found "+ outFont);
            return outFont;
        }
        
        private static int LevenshteinDistance(string s, string t)
		{
			int n = s.Length;
			int m = t.Length;
			int[,] d = new int[n + 1, m + 1];

			// Step 1
			if (n == 0)
			{
				return m;
			}

			if (m == 0)
			{
				return n;
			}

			// Step 2
			for (int i = 0; i <= n; d[i, 0] = i++)
			{
			}

			for (int j = 0; j <= m; d[0, j] = j++)
			{
			}

			// Step 3
			for (int i = 1; i <= n; i++)
			{
				//Step 4
				for (int j = 1; j <= m; j++)
				{
					// Step 5
					int cost = (t[j - 1] == s[i - 1]) ? 0 : 1;

					// Step 6
					d[i, j] = Math.Min(
						Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
						d[i - 1, j - 1] + cost);
				}
			}
			// Step 7
			return d[n, m];
		}
    }
}
