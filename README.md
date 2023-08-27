# SjekkRegning

![SjekkRegning_logo](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAb80lEQVR4Xu2dCZAdxXnHZ0FICF0rqEpx6QpWAhYgiYRbQuIKsRGsBAECBrTiSskcQsGOwQ5osWObqgASPnAlTiIJHGwnGGkNxgnGkRbJWIBBF4djbMOKQ8QuI61AEohD+f+fuod+o5npefPO3fefqle7701P99e/7q+Pr7/uCQJdIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACImAItIhE5QmsXr16XE9Pz7BIzC3Dhg3rmThx4rOVT1ExVouAFKRMsi+99NKIzs7O6cuXLz9lzZo1R7388ssjfVG2tra+NWHChDVTp079Kf4+M2XKlMeGDx/e43tO90WgVxCAUozs6Oi4efTo0d0QeGclPu3t7QuXLl16dq8AICFFII4Ahk6HT58+fUklFCIpDijdK1C+DpWACPQaAuwx2MJXUzGicUNRNixatGhmr4EkQZuTwIIFC67DnGFbLZXDTYtzFc5zmpO+ct2wBDZt2jQUw6nOeimGmy4UdMuSJUs0P2nY2tJkgkE5hqDlXl2OcvQfMmznAcdMCj/7HnZE2ZP566+/fn6TFUXdsyszb6QIMBE/csaMGUthrh1TSulAGYKRp50ZHHDspADKkPjoji09wcYnVwZvPLGy8PfNF9aXkkyAudBizE3aS3pIgXMTkII46NhzYCFvHZRjdBai6CWCce2zg3EzZwf9h0bXBbPEEBQU5bnF3wq6H/1RtgcQat68eR234sr8gALmJiAFMeg45zj55JO7sNg3IQvNidfeWJZiRNN4+9UNwaNXfypzj7Jw4cL2WbNmLc4iq8LkJyAFMezmzJlzF67rfCgHHzQyOO3uf08dRvniSLu/+uu3Bfz4Lkzct2I4eNiYMWNe8YXV/fwEpCBgt2zZspPYe/gwjsIcY/Jtd+ceTvnit/c5L3n44mnBjrfSvU9gSFiHHm981ngVrnQCe5T+SN97AkOVe3254sS7FspBOZjWJ7/zUMA5TtoF5TgS85Ev+mTX/fwEmr4HwVh+JhRkURrCQoW9FxU250Q8b/FwAv/wJdNSH+cayebNm/NZCPIK1kTPNX0PAmOQtwU+qQbDqrg6tz9MxrSQpV1QjqFQ8kubqM7WNKtN3YNkmXvQWsVPvS6umyxtmxy8/dqGRBHoVYy1kYvgcn+qcbkf485N0MtsxnxlLSJogXfAD+Bev5zm7HrlqTel29QKMnPmzHsXL158cVKB0WI1vXNFzYdWUXlefOC+YMWNn65oveKeFKzM3w7r3QLsRdlS0cj7UGRNPcTq6uqaklaWtFrVet4RJ8/Ycy7yTthLrZMYmg2BV/2tMBO/ir/zsA6keUwMxKZVEO7twIp5qpcsK2ajXNWSxShKB4Zc6+lm0yj5bRQ5mlZBoByHpBUCh1dpPlW1LkBO2Kt5sbGAkqzVhL+YctMqCCezaRVuCBSkka79Dk12gKyknHRfkZJ8RLRpFcRXqdiDNNI1+ODayWOURLsZUQH6NVIlqLEs3J+ReNWyQmbNN4d8ae7xXHmnYWHk6WcG7HFsHvjMWzATb/jJjwpewz4XFsozd+7cr2Mn4zJM4pPty1kF78XhmllBUouN6w+Ndg1IcT3hgiLXa+KsblQsfqg8xyJfdIaki33axck7lOSbCHNWo3GopTwaYiXQLnUjUy0LzU2LvQbdYI79wlczmaSpQAx7KjySfReOIZrGxVRfuL58v2kVBKvPL/W2go32DtzFeP6ydUEeC5f1TPYxwAr9Vb4wffl+MyvIb9MKltthuYmpkS7X7Mzh1Cfo8VuGAyXXVsZjR2TahVMj2xqJQa1laVoFwf6PFT7YpWyD9cVVqft2SFUp/7A/vdTrDDkYw6xUj4NK5a0R42laBWFhtLW1PZhWKL9ecl9DlRl7kLxDqqSM0NJ1+ImTU/NZ6gEWDQWtTGGaWkHo2ZrG7w8wjzZSL1It37BWzyKkFKRMLeutj/OcXbyS4O00+Z/8yk1BI5p8K8l8b/88pmm9vpu6B6GbN1y+70irbG9hov4ElKQvX5v8xojURdW+zKapFYQFSwVBL5K6H4L7MbKcNNJbK8pLq1amis53mPTWvJUrd9MrCHoRbhy60weSCkJF6W1X/+DdYFCQPIrkvvc3X+FrTpKv3rhmVKlyatqxZRTg+PHj16xdu9Z7hA5PUpx4TbxLR6UKpdR4hre8Gey7x6bgoD1eCwa2bA8O2fM3wcBge3DQnq8VovruO38dPPX+MbHRdmI7L40RSdeoUaM2dHd3jypVpr4SXgpiShKOeaMwlFiPdwsO8RXufuYIoHrtFzl9r0eCsf1+HexbUIw3U8XdvnPv4B+23gx1GbhbOG7j9fWK8+fPnwOfrK/5mPTV+1IQp2SxIDYpywKifYQr0WNnXJTL1SNvhTq635PBhXt/L/Pj/73jjIAf96JVbsVNnw664d2bdvGlo9g3c0Qzn97Y9HMQt4JAOVaWslmIrS/PrfoxPs/DO7YWriln9H8ks3Kw93hsx0e+hlQMytk5fbJXOZgI96o3s3KQgXqQmOoGJbkEm4buyVwTnYBDsDLNzVb7w5Ew79UPpfJ+jGF16vH7BfOmvpA52pvuGxCs6t51FsMb8C3biAl51svMySZmDd9Xw0lBEkqWBxjgNc0/w5xkcCMUPn2wHn3kguDIUe9nEudXG94LjjnOe6JqbFyYmL/MU+71auog0BArobqZ94QcyHeYZ6qRVQ50+mVnZ1YOivLZ2/N5ImPesZn7QKQcuwpUCpJSsblGwrOz8H7ANk5Yq6wDidGz9/jyVa2Zk2fv0XW/97D63eLjsIqTcjQOz2VOrI8HlIJkKGC8ku2HPBYHJ6nP8626Z4iu5CCXXHFMMHr41szP5ek9eMIi1oEm8iC5zAk1QUDNQUosZJxAOBhDkHPweujPoEJV/SyeYUP7B+ueOD8YNqx/JklLnXvg+NWFsFbdDMXYtaqoq4iAFKSMCoHFxZFQlun4nIuhWFX2bt89f3Jw0QVjM0vZdt1v0oZXBdsYhlLrYIBYzrN51WOko5WCZK56/oC0fOE0kFacsn4KQhcqI/4/zf6Pv5b3Bwznc20ZefDgYN2T5/sTNiF6enYE585aGezV8l6wZ/Bh4dcjxu1rep+93jj6uCu+dMpp5y3E3Gp75kibPKAUpE4VANOZW3xvqi2190jLyj7Drz6q/8A/47vfdZVAQApSAqxKBcXQ7GDfCnWpvUeabAOHXXbpgEGT8i2KVCrTvTQeWbHqUHCYFH/Vl+zdCyozpYFyzJJy+Ggn39fJivnZ5XqSE3v0Hokv7WGkk44/IJh0wv4B5xTrn38z6NmCv8/+Ydff53Z57658fGNw4w0TC5+kC8pxFZRjUS5B9VCBgIZYNa4IMKvipVaLy36nIIdgK34yPdH8O2Dw2d8cOHT6NTXOXp9LTj1IDYsU7vST4TFctnJQZPYcSWsjew084eG9h7RdW8Os9dmkNAepYdHCavWVSiTHIVjS2giU48f7tF5+VktLS9MetFAJxjYOKUglaabExd4DayL5feCduJPmHVCO/4JyTINy7FoE0VU2ASlI2QizRYDe48vZQqaHuuj8sYUJfPQyynGmlKMSlD+KQwpSWZ6xscEb+Gz0Hunne2aQg35Zcb3HHv1GPD9w6IUXSjkyQCwxiBSkRGB5guPQg2/keS76zOwrxwUjRxTv34JyrB+8399N3mPPQZsrkYbiKCYgBalyjeAe97TXTXMPBj8+MWjWnX3FuKJgUI6noRxToRzpR5v4Itf9RAIy81a5ctBZkbsS4T37P0wKf5fxL8y9hZ2KcFgMcEbwA/g7IU2UqFkXyrEKyvEJ9RxVLkBFX18CPGoIEtAkm/iBWXfn5tcv++iz8epffvDe70fUV3KlLgI1IIDD6tb6FOSh+z9ZpBzv7+g+tAaiKQkRqC8BcwZXau8Bs+57Ye+BnkPKUd8yU+o1IoCtu0NbW1s5uU5UkGFDB+zEdttdvcfGq38F5fiTGomnZAwBTdLrVBWwp/167Cocnpb87Cs/bs26v8OE/Mx+/Ue9WCdxlawI1I4AXN45wU4dWo0cMfzD7hcuZu+x5d2tK/+idtIpJRGoMwG6vPsUBNttt0A53pBy1LmwlHztCWBdhK+gTuxBJk867DUox1NQjhNrL51SdAloJb0O9QGm3afTkv3c3ENfNLsBf1YH8ZSkCNSXACxYOKBx2KaYXuTDa64+7/vbNt/35/WVUKmLQJ0JUEkwF1nEV5xRUfC3G+si7Tu2P71fnUVT8iIgAiIgAiIgAiIgAiIgAiIgAiIgAiIgAiIgAiKAQwqmYefcCuyU68QrAYr3iQpPTQmQP8phKcrjMZTLWTVNXIklEgjdKEaPHv1KOZxQwIfzbbPms4LfffFxnwXCrzSfhngJp0/mat03LyENywOOkgdWK62+GG9J7u48uoYvfsHFpeAevOxxfRQKFsAG4QUt4c84sODgcsDRJRzpnmDjYPq++JDmH+OZkvyY6GHb3d09GnHbyoSjPQt5fNaXXiPfB4sxrnz4fgi+v97IMvc62dAiz4RSvOVUnkIlQu/wOodT0QxhVXijDYsWrCx/ouiebfM9lSFfthmR1cscj3RE82e/w3dqzaJFi1JPZPcmUKcAXK23+YDCv82NWnUSpW8mm2VbKCptUWvNV5HhranfQKX7Il0qyiFj4g6HCBkVJFrZvSKkKYitYO3t7f/mjajBAvClo8wbyuNrKJeqv3S0wbJfXXHMttB3bQXB+U3r+eowwL4Tv/H810LFRQv7fLUkielBvCcUxlR2r3jRXof55Ad5LjpUwTQY3vgUoAkI8MhMd9gBhWm12WblKXUYkwdZziFWnh4kcViGYWKXzWu5Roc8DPRM/Qik7gdZs2bNUVY0tKQvYPK92X7HcONfXbF5ern9jh7mW7AgPYPPLzh/icsexvSX0vyICvcqPq/RJJxl+OTGhYn1QUjj5/g8TouV2crKIIlH/1NOE/7xtra2h7Kgx+uS/9GGo9GB7xiMPsc3R3EIht50HeZrPXzNMl61xkYk9qIczD/CbqEJ1s5xEMdCyschkfugsczRmsd8HsyhE99vzmODyJD8KEM0McZjGK3isDcmTvIrzBNpYEFe5yPO9TZOt1GMsB9BWdlgMDxloUzz58+/hiZ+fNioZLqcvNFKeaTJ2y1kifg3kFPa8JDma1uXDM8u1q9MiZcTKMNQJZwbuCDR4j5jW1wTR5EYALvI3o/+BayiyXDaEAtx32qfR5qP20TSJumsYHGypT3jG+aZ9YXYHYIo5N2sYNGe2ZEn7JWRn5+70Fz58Pw5rJRRdqgc26KTcMSzymH0RCTODnsP3C9DZQyNK/Z3Nl7ROkQFRVpvR9Nno4D0lju/Z6p+bj2DHJcbZkU8aSRC3oZEI4wZyYTPUYEzCZA3kOkVwgRjxt+Fe7SOuGkA0lNOoXPoEl7RyoZWfCl6p+dc2K6tPmaSXuipzPzoHfuc24MlVXazhmJl3upWprQhY5qCGDm2WTmQl3XI0wNufqLcUAHC/ILdNoTvhOXvVVSCHXEKz/zGVQTDrmiOhBb8ukhZsOEo5DlG6UKFRNrvQJb3aHWELDQDJ5Y7eqL57n3Kz/kpf0M8W3MoSHR4u9PEGc3bHDdvpicP5WQ9wnNLXNncepFHD1KHWDg/dgWg0bxbuHBK+d3uyjgSPwmfk911ChPUfYFL0XsQcdzN52x87P47Ozun41zaccjcL+3vS5cuPTclMwWZ0YXOwprIAP7P3oOy+gAg7c/aMBw2Yci4xfeMuZ84ZIOs0yHHQIajeRt5ORJ5OscoaeFxyHqVTYfKj6Hrx+13yDQb4dvw28fw/P9mlCdAOUww7MbjubCVRzzR3Yiu7In52Llz5/sox6O7urpOxHrQgVRcKwvXlVy5kO759jvMyPdQfuT7CJqUwWKfrHlwwhXVEfSQbSZO5u1Vp15c4MYNdjfY76w/rEd4bgaVy/4O9lfkkCd8xLsnHRWJFqvChcwPmjVr1nftcIqVEp/lWExblyJEUaEgA+G6CQ9tts/h/+/b/1FQ7jE30ReNFuK76667Pm/DY/x7kw8CKuYB7ssz3XyZZ0t5oWmYJyjIXzl5+E/7vz2smt9Z6ZzKxoW68OLcgV+grO/g//B5X37AnK1r4cIw6LdO/B/zPRt3n2s9iHONvefum48qHRQmXI13yxBDmn/Jk3b0mRkzZvzQkYPD9dgLXM8wN3a67Fz2qG/nlSOTV0HwZqQOTtBtIoB1hJuBUhKP6e5iKyUUcV8n3t1aPQxZLkEh/RHDcEhgT0pPkwVKFL7hia1eCb1HEG1BOXm0aaHVCg0ZGF5sdgo2rGyuXFD+U93vruEjIn9iax+TzzTlTovHvZdYF9zyiJahm+dS6kLWsJEDLoryibp4mI2H3h1xSmV796zpRcN5FYQPoJu6AF1uOByhy4lnApRUYEWFxd7HEcgdlrnhonG1oPcIh0pZeg9aZ9yWJM26FAcSPU/YTaOxeNZVLijPQXF5QJiieVneAqrAc6UoWp7kahl/YkOQdlIMpwJ5MsZnMikIfa6gJJ9C+BAGvrezJc+QcEUBQjmnsBdjuhx7Z5x73ICWpPBqJh7aNmbMmG6f3GwEMHyaRvMh/g8BY2h2u+9Zz/2sLXreZEoZKuZNI+m5ipa1SaSe+cmmIBQUw6qHomsamI/ck+BdmxVUaIHAUI4m28KV1hpEeo9wHpJW0ngmnMxl7T24NgHleBBK0mbj5oFvyDNPRYy9OBw1jYjNV6UrYFJ8biXKyr4U2aoRZynp+8Iy/1VRpEw9iJUOleNe4/wWCozfwsm1Lxem8niDmVPPY8PZnoA3s3j2mnChg17a69DSBGO+MSnM1VXndNhs9EoZhytvJa12r+qtc0kBSnJ3ZyQYj89CgY+1lhmaLGmjR+v5xVKlMGNDzj32dJ9lD+J0KEXRoqLeCxkKQzv0DLReFa04x8nAYRWumbxnzH5xHsZFhUTzNXqbW0tRCiqRcWgsatE4kcUwtVQ8tQ7fGxSy5oqUqiBciEHFuowlBaVYZsf7GHacQVeEnp6eVqM0V+JvyQqSZf4QrSUY9vwA6Z+DtAehN9ifi3Ac6qXVJq55GBNvC/62I183Yx4S2tfjnqUBAXF/2yoIJ/mY7M9Js36Byct58lRrTahieo2iZBWTI3WIRRs/W1F+MFE92YJFJdlKnx37nf5Jka21FRMwWpg056GV/mf7Oyr85b4CR+v9nHGBKATFAtPf+p7hfdfGzzUgLgp6nssyxMjKJmu4LFlJCpPXPJwnvjQ5y81ruc8nypaqIJH1iKJI3MUY3sg6H3AjcSf4dDyEIs7jx+e06C7y0cIUE343YO5eDijVVVn2qaAh2GZeVVAQ2zUQ2HxE3GyK0kVeeLGB6bDho9wi/kVZFCyuMLNO0tMqUqa0oz1kpNyrVlF9DVNk52RRXrKskyXF75ukhxmOLpYhwigML2Cu1rqCuHAR/2hToTpQ6U9JAdLC4ZF5hUAhGOYV0V5kN1kwDPsOzMJvGGUexDc8ZWl63V4E863Do1Y78xLO2KiMwt8C/6jP2ADughZ/Q16n2nsYzoW9dAzfLOIyTFo5eMvISSQxLBqF7TacO7KILoJGGsNxdleq9R7OmqGkcMaHr3DbVRD3f+NXljspn4KEEWMMfoHrsRtVGI6/E6QIQXNoBoH/z4EbripH/K+8BemuR5h5hXfvO3qRf7Jp45m/icgbmya9BlAhuGmscEGxwsrO765J2l2MdBUJYUJ3CQ73wCA8yIKuOzQ9UxFdZSmxRL28MsSXOQ7I+h82PvSqKIrr7+QnzVCDPN5mLZD03Stn8c6mDa6/cBqXqXH1KtpjZ+BQFCRVQQDifhsamdsbXdVK+v0TBhwXw8qG1nxlZNKb2NW68weuGxi4dwD0XJsWJ+IpGSnEzYqLivZ7Gw5yfcl5JjZ911cICn5A1t2BkOd7Nm46IrrDIldR0cMUjtghI1Z8pyCL/IncZzi34TAMDcSMUgsvIXw1hjlFcbr7Y0yjMRcNR1h+cXJFh+BQktNy5LdIDrc8uYDMYTRku8NaLBk/fvt2jnSyPxJ1bcaT4eIe/6e3b3Qzi3GrLoRzvVqZKt3D0TVyi25RPPY7PDEfdKUzLU0YFt/DlgJDFxZK4R6673dtD+fuEzH3wyjph2WfQQsU+pilPWPyF8rA1xS4MoLRgqT8cI6SsJGJRo4wTrquu6zNcT1hMmn7VSJ7Prj/I7zMPplCOvg/uh+Ei7Ox99joOffCvTY2YjYuxuO38Dzd/I2rvVuuoRzIHx0QY8sxbd+Rm2+Tz6LKS24pdamzKHCOL94hFlt2VkS01r+Lxs8JLFvNmON/XE0v6rppJkVr+ZemAMIoOa5FBbnLuLS4Sbk+Wvw9/M4Ww46H0UL1Rytm90JEnwnjc1sUyH6o09UnPsP8uW7XYFJkBeMwgwoGWbg/xa2cK9GyHY/edUOUHblSoZH+FO6EpOt6ZH4S7QnSeoYPnPjd//lz2j03zkTOLnObDk3rMLXvQ/nRgIynm3+aBwR6yc/brROcO0T88NLy5t6L5o3zz0tMA1WEmL/VZFehmyoL0uwBSV1RdlutuB2FNk72JvQO5TbLHMrdkI9YPklbVdOEjrSWXQ2ZwRShohvL4oJWs6xZlyoxt3HlLmklHS0hJ5fekxLtAqKvgM2im3ejky+eRrqfxaTI1g0t7nFoSVex94mTv9pu5OUwo5Mqxvmz2bOgh5wUFxeHlqgHu93y7B0qR6ygGou03iFWHoldP/08z/f1Z8DnaFSsY+m24/Y0MPNOtXmH9eWnjcqBZlQOHXl6JVrs8NRL1+TbyPLXjStNm2ZBzp2Mec+xqpvAdUrYGCIKjDBuX43x+ReMObLwG8fqWRYy6yR+gDnptZSTH65tQP6/NxYlt9xje5Z6ydwQ6bqWD8Izh641hGyNJET0IApb2ezfjPts6pYlbkAzG+hiLZEw3iysm3CNnLB7DizNb845VY0sdl1k45nGxpTrmnqX+Nxs6iJsTKL0vYuaWGnqbXTlbhR+kkMEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEshH4f38OKi7usXG/AAAAAElFTkSuQmCC)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/{username}/SjekkRegning)
![GitHub All Releases](https://img.shields.io/github/downloads/{username}/SjekkRegning/total)
![GitHub](https://img.shields.io/github/license/{username}/SjekkRegning)

## About
**SjekkRegning** is a innovative, user-friendly Norwegian website that makes checking your electrical bill as easy as pie. No longer will you have to struggle with deciphering intricate invoices from your electrical company. Our tool will do the heavy lifting for you. It simplifies understanding your bills, saving you time and ensuring you only pay what you owe.

## Features :sparkles:
* User-Friendly Interface.
* Swift breakdown of your electrical invoice.
* Detailed explanation of each line item.
* Saves you time and money.
* Ensures full transparency of your electrical bills.

## Getting Started :rocket:
This is the guide on how to access and utilize SjekkRegning. Follow the instructions here to see how easy it is.

###
