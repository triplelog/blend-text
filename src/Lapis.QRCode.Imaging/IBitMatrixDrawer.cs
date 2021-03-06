﻿using System;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lapis.QRCode.Encoding;

namespace Lapis.QRCode.Imaging
{
    public interface IBitMatrixDrawer
    {
        int CellSize { get; set; }

        int Margin { get; set; }

        int Foreground { get; set; }

        int Background { get; set; }

        IImage Draw(BitMatrix bitMatrix, ColorMatrix colorMatrix);
    }

    public abstract class BitMatrixDrawerBase : IBitMatrixDrawer
    {
        public int CellSize 
        { 
            get { return _cellSize; } 
            set 
            {
                if (value <= 0)
                    throw new ArgumentOutOfRangeException(nameof(CellSize));
            }
        }

        private int _cellSize = 3;

        public int Margin
        { 
            get { return _margin; } 
            set 
            {
                if (value <= 0)
                    throw new ArgumentOutOfRangeException(nameof(Margin));
            }
        }

        private int _margin = 8;

        public int Foreground { get; set; } = 0x000000;

        public int Background { get; set; } = 0xFFFFFF;

        public abstract IImage Draw(BitMatrix bitMatrix, ColorMatrix colorMatrix);
    }
    
    public interface ITripMatrixDrawer
    {
        int CellSize { get; set; }

        int MarginL { get; set; }
        
        int MarginT { get; set; }
        
        int TWidth { get; set; }
        
        int THeight { get; set; }
        
        int CellWidth { get; set; }
        
		int HashSize { get; set; }
		
		Bitmap bmp { get; set; }
        
        string BlurFormula { get; set; }
        
        string TextFormula { get; set; }
        
        string Type {get; set; }
        
        string BlurType {get; set; }
        
        string TextType {get; set; }

        int Foreground { get; set; }

        int Background { get; set; }

        IImage Draw(TripMatrix tripMatrix);
    }

    public abstract class TripMatrixDrawerBase : ITripMatrixDrawer
    {
        public int CellSize 
        { 
            get { return _cellSize; } 
            set 
            {
                if (value <= 0)
                    throw new ArgumentOutOfRangeException(nameof(CellSize));
            }
        }

        private int _cellSize = 3;
		
		public int MarginL { get; set; } = 0;
		
		public int MarginT { get; set; } = 0;
		
		public int CellWidth { get; set; } = 2;
		
		public int HashSize { get; set; } = 4;
		
		public Bitmap bmp { get; set; } = new Bitmap(10,10);
		
		public int TWidth { get; set; } = 0;
		
		public int THeight { get; set; } = 0;
		
		public string BlurFormula { get; set; } = "";
		
		public string TextFormula { get; set; } = "";
		
		public string Type { get; set; } = "";
		
		public string BlurType { get; set; } = "";
		
		public string TextType { get; set; } = "hsl";

        public int Foreground { get; set; } = 0x000000;

        public int Background { get; set; } = 0xFFFFFF;

        public abstract IImage Draw(TripMatrix tripMatrix);
    }
}
