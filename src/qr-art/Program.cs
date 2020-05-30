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
            var fontSizeOpt = app.Option("-s|--size <number>", "Font Size -- Type # for QR  -- border for gradient", CommandOptionType.SingleValue);
            var widthOpt = app.Option("-w|--width <number>", "Width", CommandOptionType.SingleValue);
            var locXOpt = app.Option("-x <number>", "location X", CommandOptionType.SingleValue);
            var locYOpt = app.Option("-y <number>", "location Y", CommandOptionType.SingleValue);
            var blurRadiusOpt = app.Option("-r <number>", "Blur Radius", CommandOptionType.SingleValue);
            var blurFormulaOpt = app.Option("-b <string>", "Blur Formula", CommandOptionType.SingleValue);
            var blurTypeOpt = app.Option("-B <string>", "Blur Formula Color Type", CommandOptionType.SingleValue);
            var textFormulaOpt = app.Option("-c <string>", "Text Formula", CommandOptionType.SingleValue);
            var textTypeOpt = app.Option("-C <string>", "Text Formula Color Type", CommandOptionType.SingleValue);
            var fontOpt = app.Option("-f <string>", "Font", CommandOptionType.SingleValue);
            var typeOpt = app.Option("-t <string>", "Type", CommandOptionType.SingleValue);
            var distanceFormulaOpt = app.Option("-d <string>", "Distance Formula", CommandOptionType.SingleValue);
            var thresholdOpt = app.Option("-l <number>", "Threshold", CommandOptionType.SingleValue);
            var gradientTypeOpt = app.Option("-g <string>", "Gradient Type -- or error correct level", CommandOptionType.SingleValue);
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
                    	
        				QRArtCreator builder = null;
        				
        				if (typeOpt.Value() != "gradient"){
        					if (typeOpt.Value() == "filter"){
        						textDrawer = new GraphicsFilterDrawer();
        					}
							builder = new QRArtCreator(
								new Triparizer(),
								textDrawer
							);
							{
								//textDrawer.Foreground = foregd;
								//textDrawer.Background = backgd;
								textDrawer.MarginL = 0;
								textDrawer.MarginT = 0;
								textDrawer.THeight = 0;
								textDrawer.TWidth = 0;
								textDrawer.HashSize = 2;
								textDrawer.CellWidth = 1;
								textDrawer.Type = typeOpt.Value();
								textDrawer.BlurType = blurTypeOpt.Value();
								textDrawer.TextType = textTypeOpt.Value();
								//textDrawer.BlurFormula = blurFormulaOpt.Value();
								textDrawer.BlurFormula = System.IO.File.ReadAllText(@"/home/rwilcox/blend-text/server/formulas/"+blurFormulaOpt.Value()+".txt");
								if (typeOpt.Value() == "filter"){
									textDrawer.TextFormula = System.IO.File.ReadAllText(@"/home/rwilcox/blend-text/server/formulas/"+blurFormulaOpt.Value()+".txt");
									textDrawer.TextType = blurTypeOpt.Value();
								}
								else {
									textDrawer.TextFormula = System.IO.File.ReadAllText(@"/home/rwilcox/blend-text/server/formulas/"+textFormulaOpt.Value()+".txt");
									textDrawer.TextType = textTypeOpt.Value();
								}
								
							}
						}
                        var builderG = new GradientCreator(
							new Triparizer(),
							textDrawer
						);
						{
							//textDrawer.Foreground = foregd;
							//textDrawer.Background = backgd;
							textDrawer.MarginL = 0;
							textDrawer.MarginT = 0;
							textDrawer.THeight = 0;
							textDrawer.TWidth = 0;
							textDrawer.HashSize = 2;
							textDrawer.CellWidth = 1;
							textDrawer.Type = typeOpt.Value();
							textDrawer.BlurType = blurTypeOpt.Value();
							textDrawer.BlurFormula = System.IO.File.ReadAllText(@"/home/rwilcox/blend-text/server/formulas/"+blurFormulaOpt.Value()+".txt");
							
						}
                        
                        
						
						int blurRadius = 5;
						Bitmap bmp = null;
						IRgb24BitmapBase bitmapText = null;
						IRgb24BitmapBase bitmap = null;
						Stopwatch stopWatch = new Stopwatch();
						stopWatch.Start();
					
						Console.WriteLine("Start Program ");
						if (textDrawer.Type == "text" || textDrawer.Type == "image"){ 
						
						
							if (int.TryParse(blurRadiusOpt.Value(), out blurRadius)){}
							textDrawer.HashSize = 1 + blurRadius / 20;
						
							string fontVal = getFont(fontOpt.Value().ToLower());
							Font font = new Font(fontVal, 16);
							int widthout = -1;
							if (int.TryParse(widthOpt.Value(), out widthout)){
							
							}
							else {
								widthout = -1;
								font = new Font(fontVal, fontSize);
								textDrawer.CellWidth = 1 + fontSize / 500;
							}	
						
							
							try
							{
								bmp = Bitmap.FromFile(imageArg.Value) as Bitmap;
								//textDrawer.bgImage = bmp;
							
								Graphics graph1 = Graphics.FromImage(bmp);
								string measureString = contentArg.Value;
							
								SizeF stringSize = new SizeF();
								stringSize = graph1.MeasureString(measureString, font);
								Console.WriteLine("width "+stringSize.Width + " height "+ stringSize.Height + "fSize "+fontSize);
								int twidth = (int)stringSize.Width + 2*blurRadius;
								int theight = (int)stringSize.Height + 2*blurRadius;
								if (widthout > -1){
									int oldSize = 16;
									int newSize = 0;
									int idx = 0;
									for (idx=0;idx<10;idx++){
										newSize = oldSize * widthout * bmp.Width / 100 / twidth;
										if (newSize > oldSize * bmp.Height / theight ){
											newSize = oldSize * bmp.Height / theight;
											oldSize = newSize;
										}
										font = new Font(fontVal, newSize );
										stringSize = graph1.MeasureString(measureString, font);
								
										twidth = (int)stringSize.Width + 2*blurRadius;
										theight = (int)stringSize.Height + 2*blurRadius;
										Console.WriteLine("Percent "+ (twidth*100/bmp.Width) );
										if (newSize == oldSize){
											break;
										}
										if ((twidth*100/bmp.Width) == widthout){
											break;
										}
										oldSize = newSize;
									}
									textDrawer.CellWidth = 1 + oldSize / 500;
								}
								Bitmap bmpp = (Bitmap) new Bitmap(twidth,theight);
							
						
							
							
								using (Graphics graph = Graphics.FromImage(bmpp))
								{
									Rectangle ImageSize = new Rectangle(0,0,twidth,theight);
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
									graph.DrawString(contentArg.Value, font, Brushes.Black, ImageSize, format);
									
								}
								bitmapText = new BitmapFrame(bmpp);
								bitmap = new BitmapFrame(bmp);
							
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
										textDrawer.MarginL = (bmp.Width * xPct)/100 - (twidth)/2;
									}
									else if (xType == 1){
										//left at (bmp.Width * xPct)/100
										textDrawer.MarginL = (bmp.Width * xPct)/100 - blurRadius;
									}
									else if (xType == 2){
										//right at (bmp.Width * xPct)/100
										textDrawer.MarginL = (bmp.Width * xPct)/100 - (twidth) + blurRadius;
									}
									else {
										textDrawer.MarginL = bmp.Width/2 - (twidth)/2;
									}
							
									if (yType == 0){
										//middle at (bmp.Height * yPct)/100
										textDrawer.MarginT = (bmp.Height * yPct)/100 - (theight)/2;
									}
									else if (yType == 1){
										//top at 
										textDrawer.MarginT = (bmp.Height * yPct)/100 - blurRadius;
									}
									else if (yType == 2){
										//bottom at 
										textDrawer.MarginT = (bmp.Height * yPct)/100 - (theight) + blurRadius;
									}
									else {
										textDrawer.MarginT = bmp.Height/2 - (theight)/2;
									}
								} //set margins
							}
							catch (Exception ex)
							{
								LogError(ex.Message);
								bitmapText = null;
							}
							textDrawer.bmp = bmp;
        				} // text on image
        				
        				if (textDrawer.Type == "filter"){ 
						
							textDrawer.HashSize = 1;
							textDrawer.CellWidth = 1;
							
							
							try
							{
								bmp = Bitmap.FromFile(imageArg.Value) as Bitmap;
								//textDrawer.bgImage = bmp;
							
								Graphics graph1 = Graphics.FromImage(bmp);
								int twidth = (int)bmp.Width;
								int theight = (int)bmp.Height;
								textDrawer.HashSize = 1 + twidth*theight/150000;
								Bitmap bmpp = (Bitmap) new Bitmap(twidth,theight);
							
								
							
							
								using (Graphics graph = Graphics.FromImage(bmpp))
								{
									Rectangle ImageSize = new Rectangle(0,0,twidth,theight);
									graph.FillRectangle(Brushes.Black, ImageSize);
									
								}
								bitmapText = new BitmapFrame(bmpp);
								bitmap = new BitmapFrame(bmp);
							
								
							}
							catch (Exception ex)
							{
								LogError(ex.Message);
								Console.WriteLine("err");
								Console.WriteLine(ex.Message);
								bitmapText = null;
							}
							textDrawer.bmp = bmp;
        				} // filter
        				
        				if (textDrawer.Type == "gradient"){ 
						
							
							if (int.TryParse(blurRadiusOpt.Value(), out blurRadius)){}
							blurRadius = 0;
							textDrawer.HashSize = 1 + blurRadius / 20;
							textDrawer.CellWidth = 1;
						
							
							try
							{
								bmp = Bitmap.FromFile(imageArg.Value) as Bitmap;
								
								Bitmap bmpp = (Bitmap) new Bitmap(bmp.Width,bmp.Height);
							
							
								using (Graphics graph = Graphics.FromImage(bmpp))
								{
									Rectangle ImageSize = new Rectangle(0,0,bmp.Width,bmp.Height);
									graph.FillRectangle(Brushes.White, ImageSize);
									graph.DrawImage(bmp, new Rectangle(0,0,bmp.Width,bmp.Height));
									
								}
								//using (Graphics graph = Graphics.FromImage(bmp))
								//{
								//	Rectangle ImageSize = new Rectangle(0,0,bmp.Width,bmp.Height);
								//	graph.FillRectangle(Brushes.White, ImageSize);
								//	
								//}
								bitmapText = new BitmapFrame(bmpp);
								bitmap = new BitmapFrame(bmp);
								textDrawer.MarginL = 0;
								textDrawer.MarginT = 0;
								
							}
							catch (Exception ex)
							{
								LogError(ex.Message);
								bitmapText = null;
							}
							textDrawer.bmp = bmp;
        				} // gradient
        				
        				if (textDrawer.Type == "qr"){ 
        				
        					textDrawer.MarginL = 0;
                            textDrawer.MarginT = 0;
                            
            				textDrawer.HashSize = 1;
            				textDrawer.CellWidth = 1;
            				int xPct = 0;
							if (int.TryParse(locXOpt.Value(), out int locXout)){
								xPct = (locXout+200)%200;
							}
							int yPct = 0;
							if (int.TryParse(locYOpt.Value(), out int locYout)){
								yPct = (locYout+200)%200;
							}
							var errorCorrect = ErrorCorrectLevel.M;
							if (gradientTypeOpt.Value() == "L"){
								errorCorrect = ErrorCorrectLevel.L;
							}
							else if (gradientTypeOpt.Value() == "Q"){
								errorCorrect = ErrorCorrectLevel.Q;
							}
							else if (gradientTypeOpt.Value() == "H"){
								errorCorrect = ErrorCorrectLevel.H;
							}
							var qrEncoder = new QRCodeEncoder()
                            {
                                TypeNumber = fontSize,
                                ErrorCorrectLevel = errorCorrect
                            };
							var bitMatrix = qrEncoder.Build(contentArg.Value);
							
							int moduleCount = bitMatrix.Size;
							var Binarizer = new Binarizer();
							var Merger = new Merger();
							textDrawer.CellWidth = 3;
							var pixels = 9;
							Bitmap nbmp = (Bitmap) new Bitmap(moduleCount * pixels * textDrawer.CellWidth,moduleCount * pixels * textDrawer.CellWidth);
							bmp = Bitmap.FromFile(imageArg.Value) as Bitmap;
							int imgWidth = bmp.Width;
							int imgHeight = bmp.Height;
							if (int.TryParse(widthOpt.Value(), out imgWidth)){
								imgWidth = moduleCount * pixels * textDrawer.CellWidth * imgWidth / 100;
								imgHeight = imgWidth * bmp.Height / bmp.Width;
							}
							
							int toCenterL = ( ( moduleCount * pixels * textDrawer.CellWidth ) * xPct - imgWidth * 50) / 100;
							int toCenterT = ( ( moduleCount * pixels * textDrawer.CellWidth ) * yPct - imgHeight * 50) / 100;
							using (Graphics graph = Graphics.FromImage(nbmp)) {
								Rectangle ImageSize = new Rectangle(0,0,nbmp.Width,nbmp.Height);
								graph.FillRectangle(Brushes.White, ImageSize);
								graph.DrawImage(bmp, new Rectangle(toCenterL,toCenterT,imgWidth,imgHeight));
							}
							
							
							Graphics graph1 = Graphics.FromImage(bmp);
							
							
							var bgImage = new BitmapFrame(nbmp);
							double threshold = .5;
							if (double.TryParse(thresholdOpt.Value(), out threshold)){
								threshold = threshold / 100;
							}
							
							var imgMatrix = Binarizer.Binarize(bgImage, moduleCount * 3, moduleCount * 3, threshold);
							bitMatrix = Merger.Merge(bitMatrix, fontSize, imgMatrix, 3);
							
							int twidth = (int)bitMatrix.ColumnCount;
							int theight = (int)bitMatrix.RowCount;
							int cellSize = textDrawer.CellWidth * pixels / 3;
							
							
							Bitmap bmpp = (Bitmap) new Bitmap(twidth*cellSize,theight*cellSize);
							textDrawer.THeight = theight*cellSize;
            				textDrawer.TWidth = twidth*cellSize;
							using (Graphics graph = Graphics.FromImage(bmpp)) {
								Rectangle ImageSize = new Rectangle(0,0,twidth*cellSize,theight*cellSize);
								graph.FillRectangle(Brushes.White, ImageSize);
								
								for (var r=0;r<theight;r++) {
									for (var c=0;c<twidth;c++) {
										if (bitMatrix[r,c]){
											graph.FillRectangle(Brushes.Black, c*cellSize, r*cellSize, cellSize, cellSize);
										}
									}
								}
								
							}
							
							
                
                
							bitmapText = new BitmapFrame(bmpp);
							bitmap = new BitmapFrame(nbmp);
							blurRadius = 0;
							textDrawer.bmp = nbmp;
						} //create qr
						
						
        				
						IImage image = null;
						if (textDrawer.Type == "gradient"){
							if (int.TryParse(blurRadiusOpt.Value(), out blurRadius)){}
							else {blurRadius = 10;}
							builderG.ystep = 1;
							builderG.xstep = 1;
							image = builderG.Create(bitmapText, blurRadius, gradientTypeOpt.Value(), fontSize);
						}
						else if (textDrawer.Type == "filter"){
							
                        	image = builder.Create(contentArg.Value, bitmap, bitmapText, blurRadius, "filter");
                        }
                        else {
							string DistanceFormula = System.IO.File.ReadAllText(@"/home/rwilcox/blend-text/server/formulas/"+distanceFormulaOpt.Value()+".txt");
						
                        	image = builder.Create(contentArg.Value, bitmap, bitmapText, blurRadius, DistanceFormula);
                        }
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
                            new Triparizer(),
                            textDrawer,
                            // frames => new BitmapImage(frames.Select(f => f as BitmapFrame))
                            frames => new Rgb24Bitmap(frames.Select(f => f as Rgb24BitmapFrame))
                        );
                        {
                            //textDrawer.Foreground = foregd;
                            //textDrawer.Background = backgd;
                        }
						
        				
                        var image = builder.Create(contentArg.Value, animation, animationText, 5, "");
                        
                       
                                                
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
				Console.WriteLine(ff.Name);
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
