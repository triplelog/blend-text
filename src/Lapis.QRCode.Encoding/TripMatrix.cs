using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lapis.QRCode.Encoding
{
    public class TripMatrix
    {

        public TripMatrix(int rowCount, int columnCount)
        {
            if (rowCount <= 0)
                throw new ArgumentOutOfRangeException(nameof(rowCount));
            if (columnCount <= 0)
                throw new ArgumentOutOfRangeException(nameof(columnCount));
            _values = new int[rowCount, columnCount];
        }

        public TripMatrix(int rowCount, int columnCount, int value)
            : this(rowCount, columnCount)
        {
            SetAll(value);
        }

        public int RowCount => _values.GetLength(0);

        public int ColumnCount => _values.GetLength(1);

        public int this[int row, int column]
        {
            get { return _values[row, column]; }
            set { _values[row, column] = value; }
        }

        public void SetAll(int value)
        {
            for (int r = 0; r < RowCount; r++)
                for (int c = 0; c < ColumnCount; c++)
                    _values[r, c] = value;
        }

        public void Fill(int rowStart, int columnStart, int rowLength, int columnLength, int value)
        {
            for (var r = rowStart; r < rowStart + rowLength && r < RowCount; r++)
            {
                for (var c = columnStart; c < columnStart + columnLength && c < ColumnCount; c++)
                    this[r, c] = value;
            }
        }
                

        public void CopyTo(TripMatrix other)
        {
            for (int r = 0; r < RowCount && r < other.RowCount; r++)
                for (int c = 0; c < ColumnCount && c < other.ColumnCount; c++)
                    other._values[r, c] = _values[r, c];
        }
        
        public void CopyTo(BitSquare other)
        {
            for (int r = 0; r < RowCount && r < other.RowCount; r++){
                for (int c = 0; c < ColumnCount && c < other.ColumnCount; c++){
                	if (_values[r, c] >= 0){
                    	other._values[r, c] = true;
                    }
                    else {
                    	other._values[r, c] = false;
                    }
                }
            }
        }

        public int[,] _values;


    }

    public class TripSquare : TripMatrix
    {
        public TripSquare(int size)
            : base(size, size)
        { }

        public int Size => RowCount;

    }
}
