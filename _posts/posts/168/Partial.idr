-- Partial Monad
-- by soimort <soi@mort.ninja>

module Partial

%default total

codata Partial a = Later (Partial a) | Now a

instance Functor Partial where
         map f (Now x) = Now (f x)
         map f (Later xs) = Later (map f xs)

instance Applicative Partial where
         pure = Now

         f <$> (Later xs) = Later (f <$> xs)
         (Now f) <$> (Now x) = Now (f x)
         (Later fs) <$> x = Later (fs <$> x)

instance Monad Partial where
         (Now a) >>= k = k a
         (Later d) >>= k = Later (d >>= k)

instance Show a => Show (Inf (Partial a)) where
         show (Now a) = show a
         show (Later d) = "." ++ show d

instance Show a => Show (Partial a) where
         show (Now a) = show a
         show (Later d) = "." ++ show d

run_for_steps : Partial a -> Nat -> Partial a
run_for_steps (Now x) _ = Now x
run_for_steps (Later x) Z = Later x
run_for_steps (Later x) (S k) = run_for_steps x k

partial
force_partial : Partial Nat -> Nat
force_partial (Now n) = n
force_partial (Later p) = force_partial p
