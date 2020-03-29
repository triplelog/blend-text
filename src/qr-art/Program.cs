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

            var contentArg = app.Argument("content", "Text to encode.");
            var imageArg = app.Argument("image", "An image to be used as background.");
            var formatArg = app.Argument("format", "Output image format. [png|gif|svg]");
            var pathArg = app.Argument("outpath", "Output path.");
            var typeOpt = app.Option("-t|--type <type>", "Type number of QR code. [1-39]", CommandOptionType.SingleValue);
            var errcorOpt = app.Option("-e|--errcor <level>", "Error correct level. [L|M|Q|H]", CommandOptionType.SingleValue);
            var foregdOpt = app.Option("-f|--foreground <color>", "Foreground color.", CommandOptionType.SingleValue);
            var backgdOpt = app.Option("-b|--background <color>", "Background color.", CommandOptionType.SingleValue);
            var cellOpt = app.Option("-c|--cell <size>", "Cell size.", CommandOptionType.SingleValue);
            var marginOpt = app.Option("-m|--margin <margin>", "Margin.", CommandOptionType.SingleValue);
            var animationOpt = app.Option("-a|--animation", "Generate animated QR code.", CommandOptionType.NoValue);

            app.OnExecute(() =>
            {
                if (!animationOpt.HasValue())
                {                    
                    if (CheckContent(contentArg.Value) &&
                        CheckImagePath(imageArg.Value, out var bitmap, out var bitmapText) &&
                        CheckFormat(formatArg.Value, out var drawer, out var textDrawer) &&
                        CheckType(typeOpt.Value(), out var type) &&
                        CheckErrorCorrectLevel(errcorOpt.Value(), out var errcor) &&
                        CheckForeground(foregdOpt.Value(), out var foregd) &&
                        CheckBackground(backgdOpt.Value(), out var backgd) &&
                        CheckCell(cellOpt.Value(), out var cell) &&
                        CheckMargin(marginOpt.Value(), out var margin))
                    {
                    	
        				
                        var builder = new QRArtCreator(
                            new QRCodeEncoder()
                            {
                                TypeNumber = type,
                                ErrorCorrectLevel = errcor
                            },
                            new Binarizer(),
                            new Triparizer(),
                            new Colorizer(),
                            new Merger(),
                            drawer,
                            textDrawer
                        );
                        {
                            drawer.CellSize = cell;
                            drawer.Margin = margin;
                            drawer.Foreground = foregd;
                            drawer.Background = backgd;
                        }
						
						
        				
        				Stopwatch stopWatch = new Stopwatch();
        				stopWatch.Start();
        				Console.WriteLine("Start Program ");
        				
                        var image = builder.Create(contentArg.Value, bitmap, bitmapText);
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
                        CheckFormatAnimation(formatArg.Value, out var drawer, out var textDrawer) &&
                        CheckType(typeOpt.Value(), out var type) &&
                        CheckErrorCorrectLevel(errcorOpt.Value(), out var errcor) &&
                        CheckForeground(foregdOpt.Value(), out var foregd) &&
                        CheckBackground(backgdOpt.Value(), out var backgd) &&
                        CheckCell(cellOpt.Value(), out var cell) &&
                        CheckMargin(marginOpt.Value(), out var margin))
                    {               
                        var builder = new QRAnimationCreator(
                            new QRCodeEncoder()
                            {
                                TypeNumber = type,
                                ErrorCorrectLevel = errcor
                            },
                            new Binarizer(),
                            new Triparizer(),
                            new Colorizer(),
                            new Merger(),
                            drawer,
                            textDrawer,
                            // frames => new BitmapImage(frames.Select(f => f as BitmapFrame))
                            frames => new Rgb24Bitmap(frames.Select(f => f as Rgb24BitmapFrame))
                        );
                        {
                            drawer.CellSize = cell;
                            drawer.Margin = margin;
                            drawer.Foreground = foregd;
                            drawer.Background = backgd;
                        }
						
        				
                        var image = builder.Create(contentArg.Value, animation, animationText);
                        
                       
                                                
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
