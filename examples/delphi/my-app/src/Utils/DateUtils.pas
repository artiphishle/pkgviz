unit Utils.DateUtils;

interface

uses
  System.SysUtils,
  System.DateUtils;

type
  TDateUtils = class
  public
    constructor Create;
    destructor Destroy; override;
    
    function FormatDate(const ADate: TDateTime): string;
    function FormatDateTime(const ADateTime: TDateTime): string;
    function IsOverdue(const ADate: TDateTime): Boolean;
    function DaysBetween(const ADate1, ADate2: TDateTime): Integer;
    function AddDays(const ADate: TDateTime; ADays: Integer): TDateTime;
    function GetCurrentDate: TDateTime;
    function GetCurrentDateTime: TDateTime;
  end;

implementation

constructor TDateUtils.Create;
begin
  inherited;
end;

destructor TDateUtils.Destroy;
begin
  inherited;
end;

function TDateUtils.FormatDate(const ADate: TDateTime): string;
begin
  Result := System.SysUtils.FormatDateTime('yyyy-mm-dd', ADate);
end;

function TDateUtils.FormatDateTime(const ADateTime: TDateTime): string;
begin
  Result := System.SysUtils.FormatDateTime('yyyy-mm-dd hh:nn:ss', ADateTime);
end;

function TDateUtils.IsOverdue(const ADate: TDateTime): Boolean;
begin
  Result := (ADate > 0) and (Now > ADate);
end;

function TDateUtils.DaysBetween(const ADate1, ADate2: TDateTime): Integer;
begin
  Result := System.DateUtils.DaysBetween(ADate1, ADate2);
end;

function TDateUtils.AddDays(const ADate: TDateTime; ADays: Integer): TDateTime;
begin
  Result := System.DateUtils.IncDay(ADate, ADays);
end;

function TDateUtils.GetCurrentDate: TDateTime;
begin
  Result := Date;
end;

function TDateUtils.GetCurrentDateTime: TDateTime;
begin
  Result := Now;
end;

end.
