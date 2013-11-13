Content-Type: text/enriched
Text-Width: 70

(package-initialize)

;;<x-color><param>#99968b</param>设置字体
</x-color>(set-default-font <x-color><param>#95e454</param>"Microsoft YaHei-10"</x-color>)
(set-default-font <x-color><param>#95e454</param>"Consolas-10"</x-color>)


(fset 'yes-or-no-p 'y-or-n-p)

(menu-bar-mode -1)

(tool-bar-mode -1)

(<x-color><param>#8ac6f2</param>when</x-color> window-system (set-frame-size (selected-frame) 80 45))


(display-time-mode 1) ;<x-color><param>#99968b</param>显示时间
</x-color>(setq display-time-24hr-format t) ;<x-color><param>#99968b</param>24小时格式
</x-color>(setq display-time-day-and-date t);<x-color><param>#99968b</param>显示日期

</x-color>

(column-number-mode t) ;<x-color><param>#99968b</param>显示列号

</x-color>

;;<x-color><param>#99968b</param>设置主模式
</x-color>(setq default-major-mode 'text-mode)


;;<x-color><param>#99968b</param>ispell强制设置为英文
</x-color>(setq ispell-dictionary <x-color><param>#95e454</param>"en_US"</x-color>)


;;<x-color><param>#99968b</param>简写操作
</x-color>
(read-abbrev-file <x-color><param>#95e454</param>"~/.emacs.d/.abbrev_defs"</x-color>)
(setq save-abbrevs t)


;; <x-color><param>#99968b</param>加载emacs.d
</x-color>(add-to-list 'load-path <x-color><param>#95e454</param>"~/.emacs.d/"</x-color>)


;;<x-color><param>#99968b</param>加载名字为"demo"的package
</x-color>;<x-color><param>#99968b</param>(load "demo")

</x-color>

;; <x-color><param>#99968b</param>对后缀为".js"的文件进入js3-mode
</x-color>(autoload 'js3-mode <x-color><param>#95e454</param>"js3"</x-color> nil t)
(add-to-list 'auto-mode-alist '(<x-color><param>#95e454</param>"\\.js\\'"</x-color> . js3-mode))


;; <x-color><param>#99968b</param>using MELPA
</x-color>(<x-color><param>#8ac6f2</param>require</x-color> '<x-color><param>#e5786d</param>package</x-color>)
(package-initialize)
(add-to-list 'package-archives
  '(<x-color><param>#95e454</param>"melpa"</x-color> . <x-color><param>#95e454</param>"http://melpa.milkbox.net/packages/"</x-color>) t)
(custom-set-variables
 ;; <x-color><param>#99968b</param>custom-set-variables was added by Custom.
</x-color> ;; <x-color><param>#99968b</param>If you edit it by hand, you could mess it up, so be careful.
</x-color> ;; <x-color><param>#99968b</param>Your init file should contain only one such instance.
</x-color> ;; <x-color><param>#99968b</param>If there is more than one, they won't work right.
</x-color> '(custom-safe-themes (quote (<x-color><param>#95e454</param>"d0ff5ea54497471567ed15eb7279c37aef3465713fb97a50d46d95fe11ab4739"</x-color> <x-color><param>#95e454</param>"e26780280b5248eb9b2d02a237d9941956fc94972443b0f7aeec12b5c15db9f3"</x-color> default)))
 '(js3-allow-keywords-as-property-names t)
 '(js3-auto-indent-p nil)
 '(js3-boring-indentation nil)
 '(js3-compact-if t)
 '(js3-consistent-level-indent-inner-bracket t)
 '(js3-enter-indents-newline t)
 '(js3-square-indent-offset 0)
 '(js3-strict-missing-semi-warning t))
(custom-set-faces
 ;; <x-color><param>#99968b</param>custom-set-faces was added by Custom.
</x-color> ;; <x-color><param>#99968b</param>If you edit it by hand, you could mess it up, so be careful.
</x-color> ;; <x-color><param>#99968b</param>Your init file should contain only one such instance.
</x-color> ;; <x-color><param>#99968b</param>If there is more than one, they won't work right.
</x-color> )


;;<x-color><param>#99968b</param>括号自动补全
</x-color>(<x-color><param>#8ac6f2</param>require</x-color> '<x-color><param>#e5786d</param>electric</x-color>)
;;<x-color><param>#99968b</param>智能缩进
</x-color>(electric-indent-mode t)
;;<x-color><param>#99968b</param>智能补全括号
</x-color>(electric-pair-mode t)
;;<x-color><param>#99968b</param>特定条件下插入新行
</x-color>(electric-layout-mode t)


;;<x-color><param>#99968b</param>自动加载某个模式
</x-color>;;<x-color><param>#99968b</param>(autoload 'php-mode "php-mode" "PHP editing mode." t)
</x-color>;;<x-color><param>#99968b</param>(setq auto-mode-list (cons '("\\.php$" . php-mode) auto-mode-list))

</x-color>


;;<x-color><param>Firebrick</param>复制代码后进行自动格式化
</x-color>;;<x-color><param>Firebrick</param>出处:http://emacser.com/torture-emacs.htm
</x-color>(<x-color><param>Purple</param>dolist</x-color> (command '(yank yank-pop))
  (eval
   `(<x-color><param>#8ac6f2</param>defadvice</x-color> ,command (after indent-region activate)
      (and (not current-prefix-arg)
           (member major-mode
                   '(emacs-lisp-mode
                     lisp-mode
                     clojure-mode
                     scheme-mode 
                     haskell-mode
                     ruby-mode
                     rspec-mode
                     python-mode
                     c-mode
                     c++-mode
                     objc-mode
                     latex-mode
                     js-mode
		     js3-mode ;<x-color><param>#99968b</param>本人用js3-mode
</x-color>                     plain-tex-mode))
           (<x-color><param>#8ac6f2</param>let</x-color> ((mark-even-if-inactive transient-mark-mode))
             (indent-region (region-beginning) (region-end) nil))))))


;;<x-color><param>#99968b</param>zen-coding
</x-color>(add-to-list 'load-path <x-color><param>#95e454</param>"~/.emacs.d/zencoding/zencoding-mode"</x-color>)


(<x-color><param>#8ac6f2</param>require</x-color> '<x-color><param>#e5786d</param>emmet-mode</x-color>)
(add-hook 'sgml-mode-hook 'emmet-mode) ;;<x-color><param>#99968b</param>autostart on any markup modes

</x-color>(global-set-key <x-color><param>#95e454</param>"\C-c\C-z"</x-color> 'emmet-expand-line)

(put 'scroll-left 'disabled nil)


;;<x-color><param>#99968b</param>key-binding

</x-color>(global-set-key <x-color><param>#95e454</param>"\C-xl"</x-color> 'goto-line)


(add-to-list 'custom-theme-load-path <x-color><param>#95e454</param>"~/.emacs.d/elpa/sublime-themes-20130911.1404"</x-color>)

(load-theme 'wombat t)


;; <x-color><param>#99968b</param>在左边显示行号

</x-color>(global-linum-mode 1)
(put 'upcase-region 'disabled nil)



;;<x-color><param>#99968b</param>设置主模式

</x-color>(setq-default auto-complete-mode t)


;;<x-color><param>#99968b</param>有关js 的auto-complete

</x-color>;; <x-color><param>#99968b</param>使用时得进入到/pat/to/auto-complete/dict 下面 ln -s javascript-mode js3-mode

</x-color>

(add-to-list 'load-path <x-color><param>#95e454</param>"/home/demohn/.emacs.d/elpa/auto-complete-20130724.1750"</x-color>)

;<x-color><param>#99968b</param>Load the default configuration

</x-color>(<x-color><param>#8ac6f2</param>require</x-color> '<x-color><param>#e5786d</param>auto-complete-config</x-color>)

; <x-color><param>#99968b</param>; Make sure we can find the dictionaries
</x-color>(add-to-list 'ac-dictionary-directories <x-color><param>#95e454</param>"/home/demohn/.emacs.d/elpa/auto-complete-20130724.1750/dict"</x-color>)
; <x-color><param>#99968b</param>Use dictionaries by default
</x-color>(setq-default ac-sources (add-to-list 'ac-sources 'ac-source-dictionary))
(global-auto-complete-mode t)
; <x-color><param>#99968b</param>Start auto-completion after 2 characters of a word
</x-color>(setq ac-auto-start 2)
; <x-color><param>#99968b</param>case sensitivity is important when finding matches
</x-color>(setq ac-ignore-case nil)
