Content-Type: text/enriched
Text-Width: 70

(package-initialize)

;;<x-color><param>Firebrick</param>设置字体
</x-color>(set-default-font <x-color><param>VioletRed4</param>"Microsoft YaHei-10"</x-color>)
(set-default-font <x-color><param>VioletRed4</param>"Consolas-10"</x-color>)


(fset 'yes-or-no-p 'y-or-n-p)


(display-time-mode 1) ;<x-color><param>Firebrick</param>显示时间
</x-color>(setq display-time-24hr-format t) ;<x-color><param>Firebrick</param>24小时格式
</x-color>(setq display-time-day-and-date t);<x-color><param>Firebrick</param>显示日期

</x-color>

(column-number-mode t) ;<x-color><param>Firebrick</param>显示列号

</x-color>

;;<x-color><param>Firebrick</param>设置主模式
</x-color>(setq default-major-mode 'text-mode)


;;<x-color><param>Firebrick</param>ispell强制设置为英文
</x-color>(setq ispell-dictionary <x-color><param>VioletRed4</param>"en_US"</x-color>)


;;<x-color><param>Firebrick</param>简写操作
</x-color>(setq-default abbrev-mode t)
(read-abbrev-file <x-color><param>VioletRed4</param>"~/.emacs.d/.abbrev_defs"</x-color>)
(setq save-abbrevs t)


;; <x-color><param>Firebrick</param>加载emacs.d
</x-color>(add-to-list 'load-path <x-color><param>VioletRed4</param>"~/.emacs.d/"</x-color>)


;;<x-color><param>Firebrick</param>加载名字为"demo"的package
</x-color>;<x-color><param>Firebrick</param>(load "demo")

</x-color>

;; <x-color><param>Firebrick</param>对后缀为".js"的文件进入js3-mode
</x-color>(autoload 'js3-mode <x-color><param>VioletRed4</param>"js3"</x-color> nil t)
(add-to-list 'auto-mode-alist '(<x-color><param>VioletRed4</param>"\\.js\\'"</x-color> . js3-mode))


;; <x-color><param>Firebrick</param>using MELPA
</x-color>(<x-color><param>Purple</param>require</x-color> '<x-color><param>dark cyan</param>package</x-color>)
(package-initialize)
(add-to-list 'package-archives
  '(<x-color><param>VioletRed4</param>"melpa"</x-color> . <x-color><param>VioletRed4</param>"http://melpa.milkbox.net/packages/"</x-color>) t)
(custom-set-variables
 ;; <x-color><param>Firebrick</param>custom-set-variables was added by Custom.
</x-color> ;; <x-color><param>Firebrick</param>If you edit it by hand, you could mess it up, so be careful.
</x-color> ;; <x-color><param>Firebrick</param>Your init file should contain only one such instance.
</x-color> ;; <x-color><param>Firebrick</param>If there is more than one, they won't work right.
</x-color> '(js3-allow-keywords-as-property-names t)
 '(js3-auto-indent-p nil)
 '(js3-boring-indentation nil)
 '(js3-compact-if t)
 '(js3-consistent-level-indent-inner-bracket t)
 '(js3-enter-indents-newline t)
 '(js3-square-indent-offset 0)
 '(js3-strict-missing-semi-warning t))
(custom-set-faces
 ;; <x-color><param>Firebrick</param>custom-set-faces was added by Custom.
</x-color> ;; <x-color><param>Firebrick</param>If you edit it by hand, you could mess it up, so be careful.
</x-color> ;; <x-color><param>Firebrick</param>Your init file should contain only one such instance.
</x-color> ;; <x-color><param>Firebrick</param>If there is more than one, they won't work right.
</x-color> )


;;<x-color><param>Firebrick</param>括号自动补全
</x-color>(<x-color><param>Purple</param>require</x-color> '<x-color><param>dark cyan</param>electric</x-color>)
;;<x-color><param>Firebrick</param>智能缩进
</x-color>(electric-indent-mode t)
;;<x-color><param>Firebrick</param>智能补全括号
</x-color>(electric-pair-mode t)
;;<x-color><param>Firebrick</param>特定条件下插入新行
</x-color>(electric-layout-mode t)


;;<x-color><param>Firebrick</param>自动加载某个模式
</x-color>;;<x-color><param>Firebrick</param>(autoload 'php-mode "php-mode" "PHP editing mode." t)
</x-color>;;<x-color><param>Firebrick</param>(setq auto-mode-list (cons '("\\.php$" . php-mode) auto-mode-list))

</x-color>


;;<x-color><param>Firebrick</param>复制代码后进行自动格式化
</x-color>;;<x-color><param>Firebrick</param>出处:http://emacser.com/torture-emacs.htm
</x-color>(<x-color><param>Purple</param>dolist</x-color> (command '(yank yank-pop))
  (eval
   `(<x-color><param>Purple</param>defadvice</x-color> ,command (after indent-region activate)
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
		     js3-mode ;<x-color><param>Firebrick</param>本人用js3-mode
</x-color>                     plain-tex-mode))
           (<x-color><param>Purple</param>let</x-color> ((mark-even-if-inactive transient-mark-mode))
             (indent-region (region-beginning) (region-end) nil))))))


;;<x-color><param>Firebrick</param>zen-coding
</x-color>(add-to-list 'load-path <x-color><param>VioletRed4</param>"~/.emacs.d/zencoding/zencoding-mode"</x-color>)


(<x-color><param>Purple</param>require</x-color> '<x-color><param>dark cyan</param>emmet-mode</x-color>)
(add-hook 'sgml-mode-hook 'emmet-mode) ;;<x-color><param>Firebrick</param>autostart on any markup modes

</x-color>(global-set-key <x-color><param>VioletRed4</param>"\C-c\C-z"</x-color> 'emmet-expand-line)

(put 'scroll-left 'disabled nil)


;;<x-color><param>Firebrick</param>key-binding

</x-color>(global-set-key <x-color><param>VioletRed4</param>"\C-xl"</x-color> 'goto-line)
