# JungleGiveway

Un bot per gestire giveaway

## Funzionalità

- **Crea Giveaway**: Avvia dei giveaway specificando il premio, la durata e il numero di vincitori.
- **Termina Giveaway**: Concludi un giveaway in corso e annuncia i vincitori.
- **Reroll**: Seleziona nuovi vincitori per un giveaway già terminato.
- **Messaggi Personalizzati**: Messaggi e embed personalizzati per le varie fasi del giveaway.

## Configurazione

Prima di avviare il bot, configura il file di configurazione `config.json` con le informazioni richieste:

```json
{
  "token": "BOT-TOKEN",
  "clientId": "BOT-CLIENT-ID",
  "guildId": "SERVER-ID",
  "giveaway": {
    "messages": {
      "giveawayStarted": "🎉 Un nuovo giveaway è iniziato! 🎉",
      "giveawayEnded": "🎉 Il giveaway è terminato! 🎉",
      "giveawayJoin": "Ti sei unito con successo al giveaway!",
      "giveawayJoinFailed": "Impossibile inviare un DM. Controlla le tue impostazioni sulla privacy.",
      "giveawayNoParticipants": "Nessun partecipante, giveaway annullato.",
      "giveawayWinner": "Congratulazioni {winners}! Hai vinto **{prize}**!",
      "giveawayCancelled": "Il giveaway è stato annullato."
    },
    "embed": {
      "title": "🎉 Giveaway 🎉",
      "description": "Premio: **{prize}**\nReagisci con 🎉 per partecipare!\nDurata: **{duration}**",
      "color": "#00FF00"
    }
  }
}
```

## Installazione

1. **Clona il repository**:
    ```bash
    git clone https://github.com/JungleStudios/JungleGiveaway.git
    cd JungleGiveway
    ```

2. **Installa le dipendenze**:
    ```bash
    yarn install
    ```

3. **Configura il bot**:
    - Modifica il file `config.json` con i dati del tuo bot.

4. **Avvia il bot**:
    ```bash
    node index.js
    ```

## Comandi Principali

- **/giveaway start**: Avvia un nuovo giveaway.
  - Opzioni:
    - `winners`: Numero di vincitori.
    - `duration`: Durata del giveaway (formato 1d1h1m1s).
    - `prize`: Premio del giveaway.
  
- **/endgiveaway**: Termina un giveaway in corso.
  - Opzioni:
    - `messageid`: ID del messaggio del giveaway da terminare.
  
- **/rerollgiveaway**: Rerolla i vincitori di un giveaway terminato.
  - Opzioni:
    - `messageid`: ID del messaggio del giveaway da rerollare.

## Contribuire

I contributi sono benvenuti! Sentiti libero di aprire issue e pull request.
