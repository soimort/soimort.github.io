-- Untyped λ-calculus as an embedded language (partial)
-- by soimort <soi@mort.ninja>

import Data.SortedMap

%default total

data Symbol = Symbol_ String

data Expr = Var Symbol
          | Lambda Symbol Expr
          | App Expr Expr

data Function = Def Expr

instance Show Symbol where
         show (Symbol_ str) = str

instance Show Expr where
         show (Var sym) = show sym
         show (Lambda sym expr) = "\\" ++ show sym ++ "." ++ show expr
         show (App expr1 expr2) = show expr1 ++ " " ++ show expr2

instance Show Function where
         show (Def expr) = show expr

mutual

  data Environment = Memory (SortedMap String Value)

  data Value = Closure Function Environment
             | Exception String

instance Show Value where
         show (Closure fun env) = show fun
         show (Exception str) = "Exception: " ++ str

mutual

  ||| Evaluate an expresssion in an environment.
  ||| @ expr the expresssion
  ||| @ env  the environment
  partial
  interp : (expr : Expr) -> (env : Environment) -> Value
  interp (Var sym) (Memory m) with (lookup (show sym) m)
         | Just val = val
         | Nothing  = Exception "undefined symbol"
  interp (Lambda sym expr) env = Closure (Def (Lambda sym expr)) env
  interp (App expr1 expr2) env = app (interp expr1 env) (interp expr2 env)

  ||| Apply a function to its argument.
  ||| @ f the function
  ||| @ a the argument
  partial
  app : (f : Value) -> (a : Value) -> Value
  app (Closure (Def (Lambda sym expr)) (Memory m)) a = interp expr (Memory (insert (show sym) a m))
  app (Exception str) a = Exception str

||| Initial environment.
env0 : Environment
env0 = Memory empty

-- Some examples:

-- λx.x
expr1 : Expr
expr1 = Lambda 'x (Var 'x)

-- λx.x λa.a
expr2 : Expr
expr2 = App (Lambda 'x (Var 'x)) (Lambda 'a (Var 'a))

-- ((λf.λx.f x) λa.a) λb.b
expr3 : Expr
expr3 = App (App (Lambda 'f (Lambda 'x (App (Var 'f) (Var 'x))))
                 (Lambda 'a (Var 'a)))
            (Lambda 'b (Var 'b))

-- λx.(x x) λx.(x x)
expr4 : Expr
expr4 = App (Lambda 'x (App (Var 'x) (Var 'x)))
            (Lambda 'x (App (Var 'x) (Var 'x)))

partial
main : IO ()
main = do putStr $ show expr1 ++ " => "
          print $ interp expr1 env0
          putStr $ show expr2 ++ " => "
          print $ interp expr2 env0
          putStr $ show expr3 ++ " => "
          print $ interp expr3 env0
