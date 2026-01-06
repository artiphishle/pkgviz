unit Utils.Logger;

interface

uses
  System.SysUtils,
  System.Classes;

type
  TLogger = class
  private
    FLogFile: string;
    procedure WriteToFile(const AMessage: string);
  public
    constructor Create;
    destructor Destroy; override;
    
    procedure Log(const AMessage: string);
    procedure LogError(const AMessage: string);
    procedure LogWarning(const AMessage: string);
    procedure LogDebug(const AMessage: string);
  end;

implementation

constructor TLogger.Create;
begin
  inherited;
  FLogFile := 'app.log';
end;

destructor TLogger.Destroy;
begin
  inherited;
end;

procedure TLogger.WriteToFile(const AMessage: string);
begin
  // File writing logic here
end;

procedure TLogger.Log(const AMessage: string);
var
  Timestamp: string;
begin
  Timestamp := FormatDateTime('yyyy-mm-dd hh:nn:ss', Now);
  WriteToFile(Format('[%s] INFO: %s', [Timestamp, AMessage]));
end;

procedure TLogger.LogError(const AMessage: string);
var
  Timestamp: string;
begin
  Timestamp := FormatDateTime('yyyy-mm-dd hh:nn:ss', Now);
  WriteToFile(Format('[%s] ERROR: %s', [Timestamp, AMessage]));
end;

procedure TLogger.LogWarning(const AMessage: string);
var
  Timestamp: string;
begin
  Timestamp := FormatDateTime('yyyy-mm-dd hh:nn:ss', Now);
  WriteToFile(Format('[%s] WARNING: %s', [Timestamp, AMessage]));
end;

procedure TLogger.LogDebug(const AMessage: string);
var
  Timestamp: string;
begin
  Timestamp := FormatDateTime('yyyy-mm-dd hh:nn:ss', Now);
  WriteToFile(Format('[%s] DEBUG: %s', [Timestamp, AMessage]));
end;

end.
