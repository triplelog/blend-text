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
        private static bool CheckContent(string content)
        {
            if (content == null)
            {
                LogError("Content required.");
                return false;
            }
            return true;
        }

        private static bool CheckImagePath(string imagePath)
        {
            if (imagePath == null)
            {
                return false;
            }
            if (!File.Exists(imagePath))
            {
                LogError("File not found.");
                return false;
            }
            try
            {
                return true;
            }
            catch (Exception ex)
            {
                LogError(ex.Message);
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
            if (string.IsNullOrWhiteSpace(s))
            {
                fontSize = 40;
                return true;
            }
            if (int.TryParse(s, out fontSize) && fontSize > 0)
                return true;
            LogError("Invalid type number.");
            return false;
        }

        private static bool CheckParams(string locX, string locY, string blurRadius, string blurColor, string textColor, string font)
        {
            if (string.IsNullOrWhiteSpace(locX))
            {
                return true;
            }
            int locXout;
            if (int.TryParse(locX, out locXout))
                return true;
            return true;
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

        

        private static void Write(IImage image, string path)
        {
            using (var stream = new System.IO.FileStream(path, System.IO.FileMode.OpenOrCreate))
            {
                image.Save(stream);
            }
        }
    }
}