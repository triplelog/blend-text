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
            var blurColorOpt = app.Option("-b <number>", "Blur Color", CommandOptionType.SingleValue);
            var textColorOpt = app.Option("-c <number>", "Text Color", CommandOptionType.SingleValue);
            var fontOpt = app.Option("-f <string>", "Font", CommandOptionType.SingleValue);
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
                        CheckParams(locXOpt.Value(), locYOpt.Value(), blurRadiusOpt.Value(), blurColorOpt.Value(), textColorOpt.Value(), fontOpt.Value())
                        //add actual checks for above values
                        //CheckForeground(foregdOpt.Value(), out var foregd) &&
                        //CheckBackground(backgdOpt.Value(), out var backgd) &&
                        )
                    {
                    	
        				
                        var builder = new QRArtCreator(
                            new Binarizer(),
                            new Triparizer(),
                            new Colorizer(),
                            new Merger(),
                            textDrawer
                        );
                        {
                            //textDrawer.Foreground = foregd;
                            //textDrawer.Background = backgd;
                        }
						PrivateFontCollection collection = new PrivateFontCollection();
						collection.AddFontFile(@"/home/rwilcox/blend-text/fonts/ABeeZee-Regular.otf");
						FontFamily fontFamily = new FontFamily("Abeezee", collection);
						Font font = new Font(fontFamily, fontSize);
						//var myFont = fontOpt.Value();
        				
        				Stopwatch stopWatch = new Stopwatch();
        				stopWatch.Start();
        				FontFamily[] ffArray = FontFamily.Families;
						foreach (FontFamily ff in ffArray)
						{
							//Add ff.Name to your drop-down list
							Console.WriteLine(ff.Name);
						}
        				Console.WriteLine("Start Program ");
        				Bitmap bmp = null;
        				IRgb24BitmapBase bitmapText = null;
        				IRgb24BitmapBase bitmap = null;
        				try
						{
							bmp = Bitmap.FromFile(imageArg.Value) as Bitmap;
							Graphics graph1 = Graphics.FromImage(bmp);
							string measureString = contentArg.Value;
							Console.WriteLine(font.FontFamily);
							SizeF stringSize = new SizeF();
							stringSize = graph1.MeasureString(measureString, font);
							Console.WriteLine("font " +myFont+ " width "+stringSize.Width + " height "+ stringSize.Height + "fSize "+fontSize);
							int twidth = (int)stringSize.Width;
							int theight = (int)stringSize.Height;
				
							Bitmap bmpp = (Bitmap) new Bitmap(twidth+40,theight+40);
							using (Graphics graph = Graphics.FromImage(bmpp))
							{
								Rectangle ImageSize = new Rectangle(0,0,twidth+40,theight+40);
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
								RectangleF rectf = new RectangleF(20, 20, twidth,theight);
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
        				
                        var image = builder.Create(contentArg.Value, bitmap, bitmapText, imageArg.Value);
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
                        CheckParams(locXOpt.Value(), locYOpt.Value(), blurRadiusOpt.Value(), blurColorOpt.Value(), textColorOpt.Value(), fontOpt.Value())
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
						
        				
                        var image = builder.Create(contentArg.Value, animation, animationText, imageArg.Value);
                        
                       
                                                
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
    }
}
