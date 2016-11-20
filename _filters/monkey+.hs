#!/usr/bin/env runhaskell
{-
  Pandoc filter to render highlighted paragraph.
-}
import Text.Pandoc.JSON
import System.IO

d :: Show a => a -> IO ()
d = hPutStrLn stderr . show

fmt :: Format
fmt = Format "html"

monkeyp :: Block -> IO Block
monkeyp b@(Para ins) =
  case head ins of
    Str "[+]" ->
      return $ Para $ [ RawInline fmt "<p style='background-color:yellow'>"
                      ] ++ tail ins ++ [ RawInline fmt "</p>" ]
    _ -> return b
monkeyp x = return x

main :: IO ()
main = toJSONFilter monkeyp
