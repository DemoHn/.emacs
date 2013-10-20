;;设置中文字体
(set-fontset-font "fontset-default"
'unicode '("Microsoft YaHei " ))

(fset 'yes-or-no-p 'y-or-n-p)

(display-time-mode 1) ;显示时间
(setq display-time-24hr-format t) ;24小时格式
(setq display-time-day-and-date t);显示日期

(column-number-mode t) ;显示列号

;;设置主模式
(setq default-major-mode 'text-mode)

;;ispell强制设置为英文
(setq ispell-dictionary "en_US")

;;简写操作
(setq-default abbrev-mode t)
(read-abbrev-file "~/.emacs.d/.abbrev_defs")
(setq save-abbrevs t)

;; 加载emacs.d
;(add-to-list 'load-path "~/.emacs.d/")

;;加载名字为"demo"的package
;(load "demo")

;; 对后缀为".js"的文件进入js3-mode
(autoload 'js3-mode "js3" nil t)
(add-to-list 'auto-mode-alist '("\\.js\\'" . js3-mode))

;; using MELPA
(require 'package)
(package-initialize)
(add-to-list 'package-archives
  '("melpa" . "http://melpa.milkbox.net/packages/") t)
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(js3-auto-indent-p t)
 '(js3-square-indent-offset 0)
 '(js3-strict-missing-semi-warning t))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )

;;括号自动补全
(require 'electric)
;;智能缩进
(electric-indent-mode t)
;;智能补全括号
(electric-pair-mode t)
;;特定条件下插入新行
;(electric-layout-mode t)


;;复制代码后进行自动格式化
;;出处:http://emacser.com/torture-emacs.htm
(dolist (command '(yank yank-pop))
  (eval
   `(defadvice ,command (after indent-region activate)
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
		     js3-mode ;本人用js3-mode
                     plain-tex-mode))
           (let ((mark-even-if-inactive transient-mark-mode))
             (indent-region (region-beginning) (region-end) nil))))))
