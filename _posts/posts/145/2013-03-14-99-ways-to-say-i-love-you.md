---
layout: post
uri: /posts/145
permalink: /posts/145/index.html
title: 【技术宅的情人节】99种用Racket说I love you的方式
category:
tag:
description:
disqus: true
lang: zh
---

![](http://pre.racket-lang.org/racket/collects/icons/heart.png)

今天是3月14日，也就是传说中的__白色情人节__（据说是个被表白一方向表白方回赠礼物以表示心意的好日子，蕴含着人们对天下有情人终成眷属的[良好祝愿](https://www.google.com/search?q=%E6%84%BF%E5%A4%A9%E4%B8%8B%E6%9C%89%E6%83%85%E4%BA%BA%E7%BB%88%E6%88%90%E5%85%84%E5%A6%B9)）。

作为一个技术宅，应该在这一天准备什么样的礼物给妹子捏？99朵玫瑰？还是巧克力？可不要被这些[商家营销手段](http://zh.wikipedia.org/wiki/%E7%99%BD%E8%89%B2%E6%83%85%E4%BA%BA%E7%AF%80)给骗了——就像Sheldon家Amy说的一样，Nerds们过一个真正属于自己的“No dinner, no romance, no gifts”的情人节才是正道啊；这种时候，只要像往常那样写写代码，用代码来说出“I love you”就好了。当然，为了表示诚意，我们要用99种——没错，是用99种不同的方式来写同一句话。

用什么语言写好捏？当然是[满满的都是爱](http://pre.racket-lang.org/racket/collects/icons/heart.png)的[Racket](http://racket-lang.org/)咯ヽ(♡´ω`♡)ノ

（先放上一段忘了从哪偷来的代码……在DrRacket里运行，就能看到一颗doki~doki跳动的红心哦）

```racket
#lang racket

(require 2htdp/universe 2htdp/image)

(define scale-factor 10)
(define window-size (* scale-factor 20))

(define (lobe shape size) (shape (* size scale-factor) 'solid 'red))
(define • (lobe circle 4))
(define •• (overlay/offset • (* 7 scale-factor) 0 •))
(define ▼ (rotate 180 (lobe triangle 14)))
(define ♥ (overlay/offset •• 0 (* 8 scale-factor) ▼))

(define amplitude 1/10)
(define speed 1/2)

(define (☺♥ n)
  (overlay (scale (add1 (* (sin (* n speed)) amplitude)) ♥)
	     (empty-scene window-size window-size)))
(animate ☺♥) 
```

下面开始，进入正题。

***

以前，穷屌丝书生喜欢发问，茴香豆的茴字有几种写法？而高富帅则会问，I love you里面的love有几种make法？不管做任何一件事情，方法上的选择总是很重要——对于敲代码的程序猿来说也一样。

在Python里，做任何事，通常有且仅有一种正确的方法；Pythonic教的传教士说：只有一种姿势最优雅，其他的体位都是邪恶的。但是Rubyists们却不以为然。他们是一群奉行自由主义的嬉皮，不需要Python里面那种类似[哲♂学](http://www.python.org/dev/peps/pep-0020/)一样的教条束缚；在解决同一个最基本的问题上有时也会跟随feeling写出新奇而孑然不同的代码。

记得刚开始接触Ruby那会，试着[用Ruby解过](https://github.com/soimort/p99#p-99-ninety-nine-prolog-problems-morts-solutions)那套经典的[P-99（99个Prolog问题）](https://sites.google.com/site/prologsite/prolog-problems)。前面好几十个问题差不多都是关于list的操作：做过一遍之后立刻就感觉到，Ruby单从表达问题的灵活性上来说，的确不是现有的其他主流语言所能够比拟的——显然，作为Perl的继任者，Ruby很好地发扬光大了这一点。

嘛，当然，要说到表达能力，基于[抖S前入式](http://en.wikipedia.org/wiki/S-expression)、把数据和代码结构高度统一起来的Lisp才是编程语言中真正的总攻（虽然这也让一部分Lisper养成了光说空话不干实事+吹嘘自己造车轮造得多么的好+不合作不贡献社区的[坏毛病](http://www.soimort.org/posts/124)）。话说回来，在Lisp里，哪怕是做最简单的一件事情——构造一个list，也能凭空造出千般万般变化。不信？继续看下去。

***

为了帮助童鞋们更好地理解Racket语言中的核心概念，Univ of Utah的CS系教授Matthew Might写了这篇[《99 ways to say `'(I love you)`》](<http://matt.might.net/articles/i-love-you-in-racket/>)。你不仅能够从中领略到Lisp那无与伦比的表达能力，还能借此复习一下Scheme/Racket中的那些基础知识点：lambdas，higher-order function，pattern matching，delayed evaluation，macros，等等——当然，后者才是此文的主要目的。

下面奉上原文翻译。（其实文字部分也就几句话）

***

Original Article: [99 ways to say '(I love you)](http://matt.might.net/articles/i-love-you-in-racket/) by [Matthew Might](https://twitter.com/mattmight)  
(Chinese Translation by __Mort Yao__)

# 99 ways to say `'(I love you)`

虽说其具有本质上的简单性，有关list的那些事儿仍然会常常让Racket程序员们困惑不已。

除开list结构本身之外，Racket程序中各种运算的表达方式更需要花上不少时间来发掘和掌握。

为了更好地强调这些重点，我写了99个不超过一条推长度的Racket表达式，它们求值的结果均得到同样的一个list：`'(I love you)`。

这些表达式中大约有一半用来展示构建或操作list的方法，剩下来的则展示了Racket中表述计算的各色方式。

所涉及到的关键知识点包括：

* 用cons连接单元（cons cells）
* 字面list记号（literal list notation）
* 加点list记号（dotted list notation）
* 反引号表示list（quasiquoted lists）
* let绑定形式（let-binding forms）
* vector和stream（vectors and streams）
* 匿名函数（anonymous functions）
* 高阶list操作（higher-order list operations）
* 条件式（conditionals）
* 结构化模式匹配（structural pattern-matching）
* 哈希表（hash maps）
* [续延（continuations）](http://en.wikipedia.org/wiki/Continuation)
* 异常（exceptions）
* [诺言（promises）](http://en.wikipedia.org/wiki/Futures_and_promises)
* 变更（mutation）
* 宏（macros）
* 端口（ports）
* [未来（futures）](http://en.wikipedia.org/wiki/Futures_and_promises)
* 参数（parameters）

以下是具体的99种方式。

如果读到任何一条不能理解的话，不妨在DrRacket的REPL里面尝试摸索一番，直到你彻底弄懂它。

## 99种方式

下面的每一枚Racket表达式，求值的结果均得到一个list `'(I love you)`：

_（原文里面没有给这99条归类，小标题是翻译君擅自加的，看的时候请注意鉴别……）_

### 1. 构造list的基本手段：`quote`和`list`

```racket
;;;
'(I love you)
```

```racket
;;;
(quote (I love you))
```

```racket
;;;
(list 'I 'love 'you)
```

```racket
;;;
(list (quote I) (quote love) (quote you))
```

### 2. 用`cons`连接单元

```racket
;;;
(cons 'I (cons 'love (cons 'you '())))
```

```racket
;;;
(cons 'I (cons 'love (list 'you)))
```

```racket
;;;
(cons 'I (list 'love 'you))
```

```racket
;;;
(cons 'I '(love you))
```

### 3. 加点list记号（Dotted list notation）

```racket
;;;
'(I love . (you))
```

```racket
;;;
'(I . (love . (you)))
```

```racket
;;;
'(I . (love . (you . ())))
```

```racket
;;;
'(I . (love you))
```

### 4. 反引号表示list（Quasiquoted lists）

```racket
;;;
`(I love you)
```

```racket
;;;
`(I ,'love you)
```

```racket
;;
(quasiquote (I ,'love  you))
```

```racket
;;
(quasiquote (I (unquote 'love) you))
```

```racket
;;;
`(I ,`love you)
```

```racket
;;;
(let ([verb 'love])
  `(I ,verb you))
```

```racket
;;;
`(I ,(string->symbol "love") you)
```

```racket
;;;
`(I ,(string->symbol (list->string '(#\l #\o #\v #\e))) you)
```

```racket
;;;
`(I love . (you))
```

```racket
;;;
`(I love . ,(list 'you))
```

```racket
;;;
`(I love ,@'(you))
```

```racket
;;;
`(I love (unquote-splicing '(you)))
```

```racket
;;;
`(I ,@(list 'love 'you))
```

```racket
;;;
`(,@(list 'I 'love) you)
```

```racket
;;;
`(,@'(I love you))
```

```racket
;;;
`,'(I love you)
```

```racket
;;;
`(I love you . ,'())
```

### 5. `car`和`cdr`

```racket
;;;
(car (list '(I love you)))
```

```racket
;;;
(cdr '(Hark! I love you))
```

### 6. `let`绑定形式（`let`-binding forms）

```racket
;;;
(let ([words '(love you I)])
  (list (car (cdr (cdr words)))
        (car words)
        (car (cdr words))))
```

```racket
;;;
(let ([words '(love you I)])
  (list (caddr words)
        (car words)
        (cadr words)))
```

```racket
;;;
(let* ([c '(you)]
       [b (cons 'love c)]
       [a (cons 'I b)])
  a)
```

```racket
;;;
(let ()
  '(I love you not)
  '(I love you))
```

### 7. vector

```racket
;;;
(vector->list (vector 'I 'love 'you))
```

```racket
;;;
(vector->list #(I love you))
```

### 8. stream

```racket
;;;
(stream->list (stream 'I 'love 'you))
```

### 9. 匿名函数（Anonymous functions）

```racket
;;;
((lambda args args) 'I 'love 'you)
```

```racket
;;;
((lambda (one two . rest) rest) 'You 'believe 'I 'love 'you)
```

```racket
;;;
((lambda (a c b) (list a b c)) 'I 'you 'love)
```

```racket
;;;
(apply (lambda (a c b) (list a b c)) 
       (list 'I 'you 'love))
```

```racket
;;;
((lambda (a b [c 'you]) (list a b c)) 'I 'love)
```

```racket
;;;
((lambda (#:foo b #:bar c #:baz a)
   (list a b c))
 #:baz 'I #:bar 'you #:foo 'love)
```

```racket
;;;
((lambda (a b #:key [c 'me]) (list a b c)) #:key 'you 'I 'love)
```

### 10. 柯里化（Currying）

```racket
;;;
(let ([f (λ (x)
           (λ (y)
             (λ (z)
               (list x y z))))])
  (((f 'I) 'love) 'you))
```

### 11. `case-lambda`

```racket
;;;
(let ([f (case-lambda 
           [() 'I]
           [(x) 'love]
           [(x y) 'you])])
  (list (f) (f 1) (f 1 2)))
```

### 12. 基础list操作

```racket
;;;
(append '(I love) '(you))
```

```racket
;;;
(append '(I) '(love) '(you))
```

```racket
;;;
(flatten '((I) (love you)))
```

```racket
;;;
(flatten '((I) (love) (you) ()))
```

```racket
;;;
(reverse '(you love I))
```

```racket
;;;
(remove 'cannot '(I cannot love you))
```

```racket
;;;
(remove-duplicates '(I love love love you))
```

```racket
;;;
(take '(I love you not) 3)
```

```racket
;;
(take-right '(I think I love you) 3)
```

```racket
;;;
(drop '(She knows I love you) 2)
```

```racket
;;;
(drop-right '(I love you no more) 2)
```

### 13. 高阶list操作（map、filter和reduce）

```racket
;;;
(map (lambda (x) (if (eq? x 'hate) 'love x))
     '(I hate you))
```

```racket
;;;
(map (λ (i) (vector-ref #(love you I) i))
     '(2 0 1))
```

```racket
;;;
(map (λ (k) (hash-ref #hash(("foo" . I) 
                            ("baz" . you)
                            ("bar" . love)) k))
     '("foo" "bar" "baz"))
```

```racket
;;;
(map string->symbol (sort (list "love" "you" "I") string<?))
```

```racket
;;;
(map string->symbol (string-split "I-love-you" "-"))
```

```racket
;;;
(flatten (map (λ (a b) (cons a b))
              '(I love you)
              '(() () ())))
```

```racket
;;;
(filter (lambda (x) (not (eq? x 'cannot))) 
        '(I cannot love you))
```

```racket
;;;
(foldr cons '() '(I love you))
```

```racket
;;;
(foldl cons '() '(you love I))
```

### 14. 迭代（Iterations）

```racket
;;;
(for/list ([word #(I love you)])
  word)
```

### 15. 条件式（Conditionals）

```racket
;;;
(cond
  [(even? 3) '(Not me)]
  [(odd?  3) '(I love you)])
```

```racket
;;;
(cond
  [(even? 3) '(Not me)]
  [(odd?  2) '(Nor I)]
  [else      '(I love you)])
```

```racket
;;;
(case 1
  [(a b c) '(Not me)]
  [(3 2 1) '(I love you)])
```

### 16. 结构化模式匹配（Structural pattern-matching）

```racket
;;;
(match #t
  [#f '(Not me)]
  [#t '(I love you)])
```

```racket
;;;
(match #t
  [#f '(Not me)]
  [_  '(I love you)])
```

```racket
;;;
(match 'you
  ['me '(Not me)]
  [x   `(I love ,x)])
```

```racket
;;;
(match '(foo bar)
  ['(foo bar) '(I love you)])
```

```racket
;;;
(match '(I cannot lift you)
  [(list 'I 'cannot _ c) `(I love ,c)])
```

```racket
;;;
(match '(2 3 1)
  [(list-no-order 3 1 2)
   '(I love you)])
```

```racket
;;;
(match '(love you I)
  [(list-no-order 'I 'love foo)
   `(I love ,foo)])
```

```racket
;;;
(match '(3 . 4)
  [(cons 3 4)
   '(I love you)])
```

```racket
;;;
(match '(3 love 1)
  [(cons 3 (cons x (cons 1 '())))
   `(I ,x you)])
```

```racket
;;;
(match '(3 love 1)
  [(cons 3 (cons x (cons 1 '())))
   `(I (unquote x) you)])
```

```racket
;;;
(match 3
  [(? symbol?) '(Not me)]
  [(? string?) '(Me neither)]
  [(? number?) '(I love you)])
```

```racket
;;;
(match 3
  [(not 4)   '(I love you)]
  [3         'unreachable])
```

```racket
;;;
(match '(you love I)
  [`(,c love ,a)
   `(,a love ,c)])
```

```racket
;;;
(match '(We love you)
  [`(,_ . ,rest)
   `(I . ,rest)])
```

```racket
;;;
(match '(We love you)
  [`(,_ ,rest ...)
   `(I ,@rest)])
```

```racket
;;;
(match '(We love you)
  [(list _ rest ...)
   `(I ,@rest)])
```

```racket
;;;
(match #(1 love 3)
  [(vector (? number?) b (? number?))
   `(I ,b you)])
```

```racket
;;;
(match #hash((1 . I) (3 . you) (5 . love))
  [(hash-table (1 a) (5 b) (3 c))
   (list a b c)])
```

```racket
;;;
(match 'you
  [(and x (? symbol?)) `(I love ,x)])
```

```racket
;;;
(match '100
  [(app (λ (n) (- n 1)) 99)
   '(I love you)])
```

### 17. 续延（Continuation）

```racket
;;;
(list 'I 
      (call/cc (λ (cc)
                 (error (cc 'love))))
      'you)
```

### 18. 异常（Exceptions）

```racket
;;;
(with-handlers ([symbol? (lambda (p)
                             `(I ,p you))])
    (raise 'love))
```

### 19. 延迟求值（Delayed evaluation）

```racket
;;;
(let ([problem (delay (car '()))])
  '(I love you))
```

```racket
;;;
`(I ,(force (delay 'love)) you)
```

```racket
;;;
(letrec ([x (delay (list a b c))]
         [a 'I]
         [c 'you]
         [b 'love])
  (force x))
```

### 20. 变更（Mutation）

```racket
;;;
(let ([word 'know])
  (set! word 'love)
  `(I ,word you))
```

```racket
;;;
(let ([word-box (box 'know)])
  (set-box! word-box 'love)
  `(I ,(unbox word-box) you))
```

### 21. 宏（Macros）

```racket
;;;
(let-syntax ([un-yoda-list
              (syntax-rules ()
                [(_ c a b) (list 'a 'b 'c)])])
  (un-yoda-list you I love))
```

### 22. 端口（Ports）

```racket
;;;
(let ((in (open-input-string "I love you")))
  (cons (read in)
        (cons (read in)
              (cons (read in) '()))))
```

### 23. 未来（Futures）

```racket
;;;
(list (touch (future (λ () 'I))) 'love 'you)
```

### 24. 参数化（Parameterization）

```racket
;;;
(let ([a (make-parameter "a")] 
      [b (make-parameter "b")]
      [c (make-parameter "c")])
  (parameterize ([a 'i] [b 'love] [c 'you])
    (list (a) 
          ((parameterize ([b 'dislike])
             (λ () (b))))
          (c))))
```

## 来自其他人的贡献

由[David Van Horn](http://dvanhorn.lambda-calcul.us/)提供：

```racket
(define `λ (λ 'love 'I 'you)) 
((λ λ λ) 
  `(λ (⊙ λ ∪) λ) 
   `(λ (λ ⊙ ∪) λ)
   `(λ (∪ ⊙ λ) λ))
```

由Bruce Bolick提供：

```racket
(define (stream-take s n)
  (if (= n 0)
      '()
      (cons (stream-first s)
            (stream-take (stream-rest s) (- n 1)))))
(define U 3)
(define I stream-take)
(define ♥ (stream  'I 'love 'you))
(I ♥ U)
```

（原文完）

***

（我表示诸位看官到这里可以直接无视以下内容了……看可以，请一笑了之。）

***

# 【无聊】伦家也要来一发嘛！![](http://static.tieba.baidu.com/tb/editor/images/qpx_n/b09.gif)

因为文章里提到的99种方式都没有涉及到logic programming，我觉得很有必要写一个自己的版本。用谓词逻辑来推导出“I love you”这种设定会很有趣的不是么……

于是就有了下面这段蛋疼的产物（用到了[Racklog](http://docs.racket-lang.org/racklog/)，一个仿Prolog的逻辑式编程扩展），最终的结果也是一样一样的`'(I love you)`：

<del>我要做一只合格的脑残偶像厨WOTA</del>＼(^o^)／

```racket
#lang racket
(require racklog)

(define %love
  (%rel ()
    [('I 'AKB48)]
    [('I 'you)]
    [('you 'I)]))

(define first-love
  (%which (who)
    (%and (%is who 'AKB48)
          (%love 'I who)
          (%love who 'I))))

(define not-that-much-but-still-love
  (%which (who)
    (%and (%love 'I who)
          (%love who 'I))))

(define (♡˙︶˙♡)
  `(I love, (cdr (car not-that-much-but-still-love))))

(♡˙︶˙♡)
```

![](http://static.tieba.baidu.com/tb/editor/images/baodong/b_0024.gif)
