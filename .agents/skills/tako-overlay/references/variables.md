# Tako Overlay Variables

Use exact variable names with no spaces inside braces.

## Alert and Media Share

Alert customization excludes media like Voice Note and GIF. Media Share customization covers the message area only.

| Variable | Meaning |
| --- | --- |
| `{{amount}}` | Raw donation amount, for example `15000`. |
| `{{formattedAmount}}` | Formatted amount, for example `IDR 15.000`. |
| `{{message}}` | Donor message. |
| `{{gifterName}}` | Donor name. |
| `{{gifterPicture}}` | Donor profile image URL. |
| `{{gifterBadges}}` | Comma-separated badge names. |
| `{{isGifterVerified}}` | `true` or `false`. |
| `{{mediaDuration}}` | Media duration in seconds, or alert duration when no media exists. |

## Leaderboard

| Variable | Meaning |
| --- | --- |
| `{{title}}` | Leaderboard title. |
| `{{rankings}}` | JSON array of `{name,picture,badges,amount,formattedAmount}`. |

## Milestone

| Variable | Meaning |
| --- | --- |
| `{{title}}` | Milestone title. |
| `{{currentAmount}}` | Raw current amount. |
| `{{formattedCurrentAmount}}` | Formatted current amount. |
| `{{targetAmount}}` | Raw target amount. |
| `{{formattedTargetAmount}}` | Formatted target amount. |
| `{{startAt}}` | Start date. |
| `{{startTime}}` | Start time. |

## Polling

| Variable | Meaning |
| --- | --- |
| `{{title}}` | Poll title. |
| `{{pollingOptions}}` | JSON array of `{id,name,totalAmount,formattedTotalAmount}`. |
| `{{startAt}}`, `{{startTime}}` | Start date and time. |
| `{{endAt}}`, `{{endTime}}` | End date and time. |

## Running Text

| Variable | Meaning |
| --- | --- |
| `{{texts}}` | JSON array of `{title,backgroundColor,textColor}`. |
| `{{gifts}}` | JSON array of `{gifterName,amount,formattedAmount}`. |

## Soundboard

| Variable | Meaning |
| --- | --- |
| `{{amount}}`, `{{formattedAmount}}` | Raw and formatted donation amount. |
| `{{soundName}}` | Selected sound effect name. |
| `{{gifterName}}`, `{{gifterPicture}}`, `{{gifterBadges}}` | Donor identity and badges. |
| `{{isGifterVerified}}` | `true` or `false`. |

## Timer

| Variable | Meaning |
| --- | --- |
| `{{title}}` | Timer title. |
| `{{timeLeft}}` | Remaining time, usually `MM:SS`. |
| `{{isEnabled}}` | `true` or `false`. |
| `{{options}}` | JSON array of `{durationAdded,minimumGiftAmount}`; duration is milliseconds. |
