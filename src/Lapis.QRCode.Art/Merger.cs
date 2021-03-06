﻿using Lapis.QRCode.Encoding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lapis.QRCode.Art
{
    public interface IMerger
    {
        BitSquare Merge(BitSquare qrCode, int typeNumber, BitMatrix backgroundMatrix, int CellSize);
    }

    public class Merger : IMerger
    {        
        public BitSquare Merge(BitSquare qrCode, int typeNumber, BitMatrix backgroundMatrix, int CellSize)
        {
            if (qrCode == null)
                throw new ArgumentNullException(nameof(qrCode));
            if (backgroundMatrix == null)
                throw new ArgumentNullException(nameof(backgroundMatrix));
            int moduleCount = qrCode.Size;
            var result = new BitSquare(moduleCount * CellSize);
            backgroundMatrix.CopyTo(result);

            for (var r = 0; r < moduleCount; r += 1)
            {
                for (var c = 0; c < moduleCount; c += 1)
                {
                    if (QRCodeHelper.IsPositionProbePattern(typeNumber, r, c) ||
                        QRCodeHelper.IsPositionAdjustPattern(typeNumber, r, c))                    
                        result.Fill(r * CellSize, c * CellSize, CellSize, CellSize, qrCode[r, c]);                    
                    else                    
                        result[r * CellSize + 1, c * CellSize + 1] = qrCode[r, c];                    
                }
            }
            return result;
        }
    }
}
